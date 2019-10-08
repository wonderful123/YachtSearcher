# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html

import re
import iso4217parse

class ScraperPipeline(object):
    def process_item(self, item, spider):
        if item.get('length'):
            # convert length string to total inches
            item['length'] = item['length'].strip()
            length = re.split('\s-', item['length'])[0]
            feet = re.findall("^\d*", length)[0]
            inches = re.findall("\s\d+\"", length)[0]
            inches = re.findall(r'\d+', inches)[0]
            total_inches = int(feet) * 12 + int(inches)
            item['length'] = total_inches

        if item.get('year'):
            item['year'] = item['year'].strip()
        if item.get('location'):
            item['location'] = item['location'].strip()
        if item.get('sale_status'):
            item['sale_status'] = item['sale_status'].title()
        if item.get('price'):
            price = item['price'].replace('AU','AUD').replace('NZ','NZD').replace('US','USD')
            currency = iso4217parse.parse(price)[0]
            item['currency'] = {
              'code': currency.alpha3,
              'name': currency.name,
              'symbol': currency.symbols[0],
              'original': item['price']
            }
            item['price'] = re.sub("\D", "", price)
        return item




import json

class JsonWriterPipeline(object):
    def open_spider(self, spider):
        self.file = open('items.jl', 'w')

        # Read in the previously visited lsitings
        try:
            self.visited_listing_file = open('prev_visited_listings.jl', 'r')
            self.prev_visited_listings = json.load(self.visited_listing_file)
            self.visited_listing_file.close()
        except IOError:
            # If not exists, create the file
            f = open('prev_visited_listings.jl', 'w')
            f.write(json.dumps([]))
            f.close()
            self.prev_visited_listings = []

        # # Open it again for rewriting
        self.visited_listing_file = open('prev_visited_listings.jl', 'w')

    def close_spider(self, spider):
        self.file.close()

    def process_item(self, item, spider):
        line = json.dumps(dict(item), ensure_ascii=False, indent=4) + "\n"
        self.file.write(line)

        # Add url to visited urls
        line = json.dumps(item["url"], ensure_ascii=False, indent=4) + "\n"
        self.visited_listing_file.write(line)
        return item
