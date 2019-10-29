# -*- coding: utf-8 -*-
import scrapy


class TestspiderSpider(scrapy.Spider):
    name = 'TestSpider'
    allowed_domains = ['http://google.com']
    start_urls = ['http://http://google.com/']

    def parse(self, response):
        pass
