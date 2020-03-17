from scraper.spiders.basespider import BaseSpider
import scrapy
import re
from scrapy.loader import ItemLoader
from scraper.items import Location, Price, Listing, Length, DefaultLoader
from scrapy.loader.processors import MapCompose, Join
from w3lib.html import remove_tags
from furl import furl


class YachtWorldSpider(BaseSpider):
    name = "yachtworld"
    start_url = 'https://www.yachtworld.com/boats-for-sale/condition-used/type-sail/?fractionalShares=0&page=1'

    def start_requests(self):
        yield scrapy.Request(url=self.start_url,
                             callback=self.parse_listings_page1)

    def parse_listings_page1(self, response):
        # parse first page, schedule all other pages at once!
        # e.g. 'http://shop.com/products?page=1'
        url = response.url

        # Each page has 15 listings
        total_listings = response.xpath('//div[@class="page-selector-text"]/text()').get()
        total_listings = re.search(r'(?<=of\s).*', total_listings).group(0)
        total_listings = int(total_listings.replace(',', ''))
        total_pages = int(total_listings / 15) + (total_listings % 15 > 0) # Rounded up

        # for testing ###########################
        total_pages = 1

        # Call parent method to set the start_index and total_pages. This also
        # checks command line arguments
        self.set_page_range(total_pages)

        # don't forget to also parse listings on first page!
        yield from self.parse_listings(response)

        # schedule every page at once!
        for page in range(self.start_index + 1, self.total_pages + 1):
            page_url = furl(url)
            page_url.args["page"] = page
            page_url = page_url.url
            yield scrapy.Request(page_url, self.parse_listings)

    def parse_listings(self, response):
        listings = response.xpath("//div[@class='listings-container']/a")

        for l in listings:
            location = DefaultLoader(item=Location(), selector=l)
            location.add_xpath('location',
                               './/div[@class="listing-card-location"]',
                               MapCompose(remove_tags))
            location.load_item()

            price = DefaultLoader(item=Price(), selector=l)
            price.add_xpath('original', './/div[@class="price"]/text()')
            price.load_item()

            length = DefaultLoader(item=Length(), selector=l)
            length.add_xpath('length',
                             './/div[contains(@class,"listing-card-length-year")]/text()')
            length.load_item()

            listing = DefaultLoader(item=Listing(), selector=l)
            year, url, thumbnail, title
            # listing.add_xpath('description', 'normalize-space(.//div[@class="text"]/p/text())')
            # listing.add_xpath('year', './/span[contains(@class, "search-result-year")]/text()', re='\d+')
            # listing.add_xpath('sale_status', './/span[@class="price"]/text()', MapCompose(parse_sale_status))
            # listing.add_xpath('title', './/span[@class="title"]/a/text()', MapCompose(parse_title))
            # url = response.urljoin(l.xpath(".//span[@class='title']/a/@href").get())
            # listing.add_value('url', url)
            # listing.add_xpath('uniq_id', './/span[@class="title"]/a/text()', MapCompose(parse_uniq_id))
            # listing.add_xpath('thumbnail_url', './/div[contains(@class,"thumb")]//img/@src')
            # listing.add_value('location', location)
            # listing.add_value('length', length)
            # listing.add_value('price', price)
            #
            # # Check if deep scraping the listing is required
            # if (self.prev_visited_listings.get(url) or {}).get('is_deep_scraped'):
            #     yield listing.load_item()
            # else:
            #     request = scrapy.Request(url, self.parse_listing_page, dont_filter=True)
            #     # Pass listing to next function
            #     request.cb_kwargs['listing'] = listing.load_item()
            #     yield request

    # This is the parser for the deep scraped listing page
    def parse_listing_page(self, response, listing):
        loader = DefaultLoader(item=listing, response=response)
        loader.add_xpath('hull_material',
                         '//strong[text()="Hull Type"]/../span/text()',
                         re='(?<=: ).*')
        loader.add_xpath('full_description', '//div[@class="desc"]/p/text()',
                         Join())
        loader.add_xpath('image_urls', '//div[@id="galleria"]//a/@href')
        loader.add_xpath('make', '//strong[text()="Brand"]/../span/text()',
                         re='(?<=: ).*')
        loader.add_xpath('model', '//strong[text()="Model"]/../span/text()',
                         re='(?<=: ).*')
        loader.add_value('is_deep_scraped', 'true')  # flag item for database
        listing = loader.load_item()
        return listing


def parse_location(s):
    pass


def parse_sale_status(s):
    s = s.replace("Price : ", "")  # remove leading tag
    s = re.sub(r"(\$|€)\d+(,|.)\d+", "", s)  # remove price
    s = re.sub("- Now", "", s)  # remove "- Now"
    s = re.sub(r"($i)\s*million", '', s)  # remove "Million"
    s = s.strip().title()  # remove extra spaces and title case
    s = " ".join(s.split())  # normalize spaces
    return s


def parse_title(title):
    # Remove price from title
    title = re.sub(r'(\$|€).*', '', title)
    title = title.strip()
    items = re.split(r"\s*-\s*", title)
    title = f"{items[0]} - {items[1]}"
    return title


def parse_price(s):
    # Grab the price and add AUD to it if it contains a $ sign
    currency_symbols = u'[$¢£¤¥֏؋৲৳৻૱௹฿៛\u20a0-\u20bd\ua838\ufdfc\ufe69\uff04\uffe0\uffe1\uffe5\uffe6]'
    s = re.findall(currency_symbols+r'.*', s)
    if s:
        s = s[0]
        if re.search(r'\$', s):
            return "AUD " + s
        return s
    return ''


def parse_uniq_id(title):
    # Take title such as "GP42 - Elena Nova - SOLD"
    # Return yoti-gp42-elena-nova
    title = re.sub(r'(\$|€).*', '', title)
    title = title.strip()
    items = re.split(r"\s*-\s*", title)
    uniq_id = f"yoti-{items[0]}-{items[1]}".lower().replace(' ', '-')
    return uniq_id
