# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy

class Listing(scrapy.Item):
    title = scrapy.Field()
    url = scrapy.Field()
    description = scrapy.Field()
    sale_status = scrapy.Field()
    length = scrapy.Field()
    thumbnail = scrapy.Field()
    images = scrapy.Field()
    hull_material = scrapy.Field()
    unique_id = scrapy.Field()
    make = scrapy.Field()
    model = scrapy.Field()
    year = scrapy.Field()

class Length(scrapy.Item):
    length = scrapy.Field()
    metres = scrapy.Field()
    feet = scrapy.Field()
    total_inches = scrapy.Field()

class Price(scrapy.Item):
    price = scrapy.Field()
    symbol = scrapy.Field()
    name = scrapy.Field()
    original = scrapy.Field()

class Location(scrapy.Item):
    location = scrapy.Field()
    latitude = scrapy.Field()
    longitude = scrapy.Field()
    country = scrapy.Field()
    city = scrapy.Field()
    state = scrapy.Field()
    state_code = scrapy.Field()
    regions = scrapy.Field()
