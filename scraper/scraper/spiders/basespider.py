import scrapy

class BaseSpider:
    def __init__(self, *args, **kwargs):
            super(scrapy.Spider, self).__init__(*args, **kwargs)
