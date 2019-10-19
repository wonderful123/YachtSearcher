import scrapy, re
from scrapy.loader.processors import Join, MapCompose, TakeFirst, Identity
from scrapy.loader import ItemLoader

def printer(values):
    for v in values:
        print("PRINTER"* 20)
        print(v)
        yield v

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

# Note: have to add TakeFirst to fields that are deep scraped because of how item loader works
class Listing(scrapy.Item):
    title = scrapy.Field()
    url = scrapy.Field()
    description = scrapy.Field()
    full_description = scrapy.Field()
    sale_status = scrapy.Field(input_processor=MapCompose(str.title), output_processor=TakeFirst())
    length = scrapy.Field()
    thumbnail = scrapy.Field()
    images = scrapy.Field()
    hull_material = scrapy.Field(output_processor=TakeFirst())
    uniq_id = scrapy.Field()
    make = scrapy.Field(output_processor=TakeFirst())
    model = scrapy.Field(output_processor=TakeFirst())
    year = scrapy.Field(input_processor=MapCompose(str.strip), output_processor=TakeFirst())
    location = scrapy.Field()
    price = scrapy.Field()
    is_deep_scraped = scrapy.Field(input_process=MapCompose(printer), output_process=TakeFirst())
    is_location_scraped = scrapy.Field(output_process=TakeFirst())
