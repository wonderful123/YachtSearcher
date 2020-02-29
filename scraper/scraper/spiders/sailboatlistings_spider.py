from scraper.spiders.basespider import BaseSpider
import scrapy
import re
from scrapy.loader import ItemLoader
from scraper.items import Location, Price, Listing, Length, DefaultLoader
from scrapy.loader.processors import MapCompose, Join
from scrapy.utils.markup import remove_tags
from furl import furl


class SailBoatListingsSpider(BaseSpider):
    name = "sailboatlistings"
    start_url = 'https://www.sailboatlistings.com/cgi-bin/saildata/db.cgi?db=default&uid=default&view_records=1&ID=*&sb=date&so=descend&nh=1'

    def __init__(self, category=None, *args, **kwargs):
        super(SailBoatListingsSpider, self).__init__(*args, **kwargs)

    def start_requests(self):
        yield scrapy.Request(url=self.start_url,
                             callback=self.parse_listings_page1)

    def parse_listings_page1(self, response):
        # parse first page, schedule all other pages at once!
        # e.g. 'http://shop.com/products?page=1'
        url = response.url

        # Each page has 100 listings
        total_listings = response.xpath('//p/font/b/text()').get()
        total_listings = int(total_listings)
        total_pages = int(total_listings / 100) + (total_listings % 100 > 0) # Rounded up

        # Call parent method to set the start_index and total_pages. This also
        # checks command line arguments
        self.set_page_range(total_pages)

        # don't forget to also parse listings on first page!
        yield from self.parse_listings(response)

        # schedule every page at once!
        for page in range(self.start_index + 1, self.total_pages + 1):
            page_url = furl(url)
            page_url.args["nh"] = page
            page_url = page_url.url
            yield scrapy.Request(page_url, self.parse_listings)

    def parse_listings(self, response):
        listings = response.xpath('//td[@bgcolor="#999999"]')

        for l in listings:
            location = DefaultLoader(item=Location(), selector=l)
            location.add_xpath('location', './/td/span/text()[contains(.,"Location")]/../../../td[2]/span/text()')
            location.load_item()

            price = DefaultLoader(item=Price(), selector=l)
            price.add_xpath('original', './/td/span[text()[contains(.,"Asking:")]]/../..//span[@class="sailvk"]/text()')
            price.load_item()

            length = DefaultLoader(item=Length(), selector=l)
            length.add_xpath('length', './/span[contains(text(),"Length:")]/../../td[2]/span[1]/text()')
            length.load_item()

            listing = DefaultLoader(item=Listing(), selector=l)
            listing.add_xpath('url', '//a[@class="sailheader"]/@href')
            url = l.xpath('.//a[@class="sailheader"]/@href').get()
            listing.add_value('url', url)
            thumbnail_url = l.xpath(".//img/@src").get()
            if thumbnail_url:
                thumbnail_url = response.urljoin(thumbnail_url)
                listing.add_value('thumbnail_url', thumbnail_url)
            listing.add_xpath('year', './/span[contains(text(),"Year:")]/../../td[2]/span[1]/text()')
            listing.add_xpath('type', './/span[contains(text(),"Type:")]/../../td[2]/span[1]/text()')
            listing.add_xpath('hull_material', './/span[contains(text(),"Hull:")]/../../td[2]/span[1]/text()', re=('.*(?=\s)'))
            listing.add_xpath('first_found', '..//span[@class="details"]/text()', re='(?<=Added\s).*(?=\s)')
            title = l.xpath('.//a[@class="sailheader"]/text()').get()
            url_id = furl(url).path.segments[-1]
            uniq_id = f"sailboatlistings-{title}-{url_id}".replace(' ', '-').lower()
            listing.add_value('title', title)
            listing.add_value('uniq_id', uniq_id)
            listing.add_value('location', location)
            listing.add_value('length', length)
            listing.add_value('price', price)

            # Check if deep scraping the listing is required
            if (self.prev_visited_listings.get(url) or {}).get('is_deep_scraped'):
                yield listing.load_item()
            else:
                request = scrapy.Request(url, self.parse_listing_page, dont_filter=True)
                # Pass listing to next function
                request.cb_kwargs['listing'] = listing.load_item()
                yield request

    # This is the parser for the deep scraped listing page
    def parse_listing_page(self, response, listing):
        loader = DefaultLoader(item=listing, response=response)
        loader.add_xpath('description', '//td/font/text()[contains(.,"Description")]/../../../td[2]/font/text()', Join())
        loader.add_xpath('full_description', '//td/font/text()[contains(.,"Description")]/../../../td[2]/font/text()', Join())
        # Also add equipment list
        loader.add_value('full_description', '/n<strong>Equipment: </strong>')
        loader.add_xpath('full_description', '//td/font/text()[contains(.,"Equipment")]/../../../td[2]/font/text()', Join())
        image_urls = response.xpath('//a[@rel[contains(.,"lightbox")]]/img/@src').getall()
        # Join partial url and replace /t/ in url to get large version from thumbnail
        image_urls = list(map(lambda url: response.urljoin(url).replace('/t/','/m/'), image_urls))
        loader.add_value('image_urls', image_urls)
        make_model = response.xpath('//font[@size="3"]/..//font[@size="4"]/text()').get().split('\n')
        loader.add_value('make', make_model[1])
        loader.add_value('model', make_model[2])
        loader.add_value('is_deep_scraped', 'true') # flag item for database
        listing = loader.load_item()

        return listing
