import scrapy, re
from scrapy.loader.processors import Join, MapCompose, TakeFirst, Identity
from scrapy.loader import ItemLoader

class DefaultLoader(ItemLoader):
    default_input_processor = Identity()
    default_output_processor = TakeFirst()

class Length(scrapy.Item):
    length = scrapy.Field()
    meters = scrapy.Field()
    feet = scrapy.Field()
    total_inches = scrapy.Field()

class Price(scrapy.Item):
    price = scrapy.Field()
    symbol = scrapy.Field()
    name = scrapy.Field()
    code = scrapy.Field()
    original = scrapy.Field()

class Location(scrapy.Item):
    location = scrapy.Field(input_processor=MapCompose(str.strip))
    latitude = scrapy.Field()
    longitude = scrapy.Field()
    country = scrapy.Field()
    city = scrapy.Field()
    state = scrapy.Field()
    state_code = scrapy.Field()
    regions = scrapy.Field()

class Listing(scrapy.Item):
    title = scrapy.Field()
    url = scrapy.Field()
    description = scrapy.Field()
    sale_status = scrapy.Field(input_processor=MapCompose(str.title))
    length = scrapy.Field()
    thumbnail = scrapy.Field()
    images = scrapy.Field()
    hull_material = scrapy.Field()
    uniq_id = scrapy.Field()
    make = scrapy.Field()
    model = scrapy.Field()
    year = scrapy.Field(input_processor=MapCompose(str.strip))
    location = scrapy.Field()
    price = scrapy.Field()
