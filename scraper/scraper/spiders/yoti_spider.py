from scrapy.loader import ItemLoader
from scraper.items import Location, Price, Listing, Length, DefaultLoader
from scrapy.loader.processors import MapCompose
import scrapy, re, json
from furl import furl
from scraper.database import Database

class YotiSpider(scrapy.Spider):
    name = "yoti"
    start_url = 'https://www.yoti.com.au/search-result/1/'
    start_index = 1
    # this can be overridden from the command line:
    # scrapy crawl spidername -a page_depth=100
    page_depth = 1
    scrape_location = "false"

    def __init__(self, category=None, *args, **kwargs):
        super(YotiSpider, self).__init__(*args, **kwargs)
        # init function to load previously visited listings then we can check if we need to deep scrape the page later
        self.prev_visited_listings = Database(self.name).load_prev_visited()

    def start_requests(self):
        yield scrapy.Request(url=self.start_url, callback=self.parse_listings_page1)

    def parse_listings_page1(self, response):
        # parse first page, schedule all other pages at once!
        # e.g. 'http://shop.com/products?page=1'
        url = response.url

        start = int(self.start_index) or 1  # from command line arguments or default
        # Get total pages
        last_page_link = response.css('a[aria-label=Last]').attrib['href']
        total_pages = int(furl(last_page_link).args["page"])

        # convert to int in case it was passed as string from command line
        self.page_depth = int(self.page_depth)
        # leave at all for 0 or set less.
        if self.page_depth != 0 or self.page_depth < total_pages:
            total_pages = self.page_depth

        # don't forget to also parse listings on first page!
        yield from self.parse_listings(response)

        # schedule every page at once!
        for page in range(start + 1, total_pages + 1):
            page_url = furl(url)
            page_url.args["page"] = page
            page_url = page_url.url
            yield scrapy.Request(page_url, self.parse_listings)

    def parse_listings(self, response):
        listings = response.xpath("//div[contains(@id, 'searchform')]/div[@class='box ']/div[@class='middle']/div[@class='center']")

        for l in listings:
            location = DefaultLoader(item=Location(), selector=l)
            location.add_xpath('location', './/span[@class="listing-contact"]/text()')
            location.load_item()

            price = DefaultLoader(item=Price(), selector=l)
            # Price is in title "Farr 30 - Brannew - $65,000" - split right then add AUD
            price.add_xpath('original', ".//span[@class='title']/a/text()", MapCompose(lambda s: "AUD "+s.rsplit(' ',1)[1]))
            price.load_item()

            length = DefaultLoader(item=Length(), selector=l)
            length.add_xpath('length', './/div[@class="boat-length"]/text()')
            length.load_item()

            listing = DefaultLoader(item=Listing(), selector=l)
            listing.add_xpath('description', 'normalize-space(.//div[@class="text"]/text())')
            listing.add_xpath('year', './/span[contains(@class, "search-result-year")]/text()', re='\d+')
            listing.add_xpath('sale_status', './/span[@class="price"]/text()', MapCompose(parse_sale_status))
            listing.add_xpath('title', './/span[@class=title]/a/text()', MapCompose(parse_title))
            url = response.urljoin(l.xpath(".//span[@class='title']/a/@href").get())
            listing.add_value('url', url)
            listing.add_value('uniq_id', 'yoti-' + re.findall('(?<=listing\/).*', url)[0])
            listing.add_xpath('thumbnail', './/div[contains(@class,"thumb")]//img/@src')
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
        loader = ItemLoader(item=listing, response=response)
        loader.add_xpath('hull_material', '//strong[text()="Hull Type"]/../span/text()', re='(?<=: ).*')
        loader.add_xpath('full_description', '//div[@class="desc"]/text()')
        loader.add_xpath('images', '//div[@class="galleria-thumbnails"]//div[contains(@class,"galleria-image")]//img/@src', re=r'_thumb') # strip thumb from thumbnail filename to get full image
        loader.add_value('make', '//strong[text()="Brand"]/../span/text()', re='(?<=: ).*')
        loader.add_value('model', '//strong[text()="Model"]/../span/text()', re='(?<=: ).*')
        loader.add_value('is_deep_scraped', 'true') # flag item for database
        listing = loader.load_item()
        return listing

def parse_sale_status(s):
    s = s.replace("Price : " , "") # remove leading tag
    s = re.sub("(\$|€)\d+,\d+", "", s) # remove price
    s = re.sub("- Now", "", s) # remove "- Now"
    s = s.strip().title() # remove extra spaces and title case
    s = " ".join(s.split()) # normalize spaces
    return s

def parse_title(s):
    # return first 2 segments only
    split = s.split(' - ')
    return f"{split[0]} - {split[1]}"
