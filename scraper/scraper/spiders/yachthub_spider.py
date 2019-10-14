from scrapy.loader import ItemLoader
from scraper.items import Location, Price, Listing, Length, DefaultLoader
import scrapy
import re
from furl import furl

class YachthubSpider(scrapy.Spider):
    name = "yachthub"
    start_url = 'https://yachthub.com/list/search.html?page=1&order_by=added_desc&se_region=all&action=adv_search&new=used&cate=Sail&price_from=1&price_to=100000000'
    start_index = 1

    def start_requests(self):
        yield scrapy.Request(url=self.start_url, callback=self.parse_listings_page1)

    def parse_listings_page1(self, response):
        # parse first page, schedule all other pages at once!
        # e.g. 'http://shop.com/products?page=1'
        url = response.url

        start = self.start_index or 1  # from arguments
        # Get total pages
        last_page_link = response.css("ul.pagination li a")[-1].attrib['href']
        total_pages = furl(last_page_link).args["page"]

        total_pages = 1

        # don't forget to also parse listings on first page!
        yield from self.parse_listings(response)

        # schedule every page at once!
        for page in range(start + 1, total_pages + 1):
            page_url = furl(url)
            page_url.args["page"] = page
            page_url = page_url.url
            yield from scrapy.Request(page_url, self.parse_listings)

    def parse_listings(self, response):
        listings = response.xpath("//div[contains(@class, 'List_Row_Listing')]")

        for l in listings:
            location = DefaultLoader(item=Location(), selector=l)
            location.add_xpath('location', './/div[contains(@class, "bw_List_Location")]/text()')
            location.load_item()

            price = DefaultLoader(item=Price(), selector=l)
            price.add_xpath('original', './/span[contains(@class, "bw_List_Price")]/text()')
            price.load_item()

            length = DefaultLoader(item=Length(), selector=l)
            length.add_xpath('length', './/div[contains(@class, "bw_List_Length")]/text()')
            length.load_item()

            listing = DefaultLoader(item=Listing(), selector=l)
            listing.add_xpath('description', 'normalize-space(.//div[contains(@class, "bw_List_Text")]/text())')
            listing.add_xpath('year', './/div[contains(@class, "bw_List_Year")]/text()')
            listing.add_xpath('sale_status', './/span[contains(@class, "text-overlay")]/text()')
            listing.add_xpath('title', './/div[contains(@class, "List_MakeModel")]/a/text()')
            url = response.urljoin(l.xpath('.//div[contains(@class, "List_MakeModel")]/a/@href').get())
            listing.add_value('url', url)
            listing.add_value('uniq_id', 'yachthub-' + re.search('\d*$', url).group(0))
            listing.add_xpath('thumbnail', './/span[contains(@class, "thumb-info")]/img/@src')
            listing.add_value('location', location)
            listing.add_value('length', length)
            listing.add_value('price', price)

            x= listing.load_item()
            print(x)
            yield x
