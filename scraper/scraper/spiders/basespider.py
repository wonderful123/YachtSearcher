import scrapy
from scraper.database import Database


# Base spider moves setting of command line arguments out of spider and
# database loading
class BaseSpider(scrapy.Spider):
    def __init__(self, *args, **kwargs):
        super(BaseSpider, self).__init__(*args, **kwargs)

        # load previously deep scraped listings
        self.prev_visited_listings = Database(self.name).load_prev_visited()

        # Set default options or from command line if given
        self.start_index = int(self.start_index) if hasattr(self, 'start_index') else 1
        self.scrape_location = int(self.scrape_location) \
            if hasattr(self, 'scrape_location') else 'false'

        # convert to int in case it was passed as string from command line
        self.page_depth = int(self.page_depth) if hasattr(self, 'page_depth') else 0

    def set_page_range(self, total_pages):
        # Zero is all, or check if page_depth is more than total_pages
        if self.page_depth != 0 and self.page_depth < total_pages:
            self.total_pages = self.page_depth
        else:
            self.total_pages = total_pages
