import scrapy
import re
from furl import furl

class QuotesSpider(scrapy.Spider):
    name = "index"
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
            listing = Listing()
            listing["description"] = l.xpath('.//div[contains(@class, "bw_List_Text")]/text()').get()
            listing["year"] = l.xpath('.//div[contains(@class, "bw_List_Year")]/text()').get()
            listing["sale_status"] = l.xpath('.//span[contains(@class, "text-overlay")]/text()').get()
            listing["length"] = l.xpath('.//div[contains(@class, "bw_List_Length")]/text()').get()
            listing["title"] = l.xpath('.//div[contains(@class, "List_MakeModel")]/a/text()').get()
            listing["url"] = response.urljoin(l.xpath('.//div[contains(@class, "List_MakeModel")]/a/@href').get())
            listing["thumbnail"] = l.xpath('.//span[contains(@class, "thumb-info")]/img/@src').get()

            location = Location()
            location["location"] = l.xpath('.//div[contains(@class, "bw_List_Location")]/text()').get()

            price = Price()
            price["price"] = l.xpath('.//span[contains(@class, "bw_List_Price")]/text()').get()

            yield listing, location, price
