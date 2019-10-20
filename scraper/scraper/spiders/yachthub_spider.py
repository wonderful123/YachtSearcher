from scrapy.loader import ItemLoader
from scraper.items import Location, Price, Listing, Length, DefaultLoader
import scrapy, re, json
from furl import furl
from scraper.database import Database

class YachthubSpider(scrapy.Spider):
    name = "yachthub"
    start_url = 'https://yachthub.com/list/search.html?page=1&order_by=added_desc&se_region=all&action=adv_search&new=used&cate=Sail&price_from=1&price_to=100000000'
    start_index = 1
    # this can be overridden from the command line:
    # scrapy crawl spidername -a page_depth=100
    page_depth = 1
    scrape_location = "false"

    def __init__(self, category=None, *args, **kwargs):
        super(YachthubSpider, self).__init__(*args, **kwargs)
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
        last_page_link = response.css("ul.pagination li a")[-1].attrib['href']
        total_pages = furl(last_page_link).args["page"]

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
        listings = response.xpath("//div[contains(@class, 'List_Row_Listing')]")

        # listings = [listings[0]]
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
        loader.add_xpath('hull_material', '//div[contains(@class, "Yacht_HullMaterial")]/div[contains(@class,"Field")]/text()')
        loader.add_xpath('full_description', '//div[contains(@class, "Yacht_Desc")]/div[contains(@class,"Field")]/text()')
        loader.add_xpath('images', '//div[@id="galleria"]/a/img/@src')
        # get make and model hidden in script meta data
        script_meta_data = response.xpath('normalize-space(//script[@id="loopa_info"])').get()
        meta_data = json.loads('{' + script_meta_data + '}')
        loader.add_value('make', meta_data['make'])
        loader.add_value('model', meta_data['model'])
        loader.add_value('is_deep_scraped', 'true') # flag item for database
        listing = loader.load_item()
        return listing
