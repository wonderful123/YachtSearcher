# -*- coding: utf-8 -*-
import json
import datetime
import os
from .lib import parse
from scraper.database import Database
from scrapy.pipelines.images import ImagesPipeline
import scrapy
import logging
from pprint import pformat


class ScraperPipeline(object):
    def process_item(self, item, spider):
        if item.get('length'):
            item['length'] = item['length'].get_collected_values('length')[0]
            lengths = parse.length(item['length'])
            item['length'] = lengths

        if item.get('price'):
            item['price'] = item['price'].get_collected_values('original')[0]
            item['price'] = parse.price(item['price'])

        if item.get('location'):
            values = item['location'].get_collected_values('location')
            logging.warning(values)
            if values != []:
                item['location'] = values[0]
            else:
                item['location'] = ''

            # parse location with API - this can be set to false for testing
            if spider.scrape_location == "true":
                location_data = parse.location(item['location'])
                item['location'] = location_data
                # set flag so location scrape is not done twice later on
                item['is_location_scraped'] = 'true'

        if item.get('listing'):
            print(item['listing'])

        return item


class DatabasePipeline(object):
    def open_spider(self, spider):
        self.db = Database(spider.name)

    def close_spider(self, spider):
        self.db.close_connection()

    def process_item(self, item, spider):
        # Remove key if available then flag the data in database
        if item.pop('is_deep_scraped', False):
            self.db.flag_listing_data(item['url'], 'is_deep_scraped')
        if item.pop('is_location_scraped', False):
            self.db.flag_listing_data(item['url'], 'is_location_scraped')

        return item


class JsonItemWriterPipeline(object):
    def open_spider(self, spider):
        os.makedirs("./data/processing", exist_ok=True)
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d--%H-%M-%S")
        self.filename = f"data/processing/[{spider.name}]-{timestamp}.jl"
        self.file = open(self.filename, 'w')

    def close_spider(self, spider):
        self.file.close()
        # move the file after it has processed so there's no conflict if rails
        # loads it at the same time
        os.rename(self.filename, self.filename.replace('processing/', ''))

    def process_item(self, item, spider):
        line = json.dumps(dict(item)) + "\n"
        self.file.write(line)
        return item


class BoatImagesPipeline(ImagesPipeline):
    def get_media_requests(self, item, info):
        if item.get('image_urls'):
            for image_url in item['image_urls']:
                yield scrapy.Request(image_url)
        if item.get('thumbnail_url'):
            yield scrapy.Request(item['thumbnail_url'])

    def item_completed(self, results, item, info):
        for download_status, result in results:
            if result['url'] == item.get('thumbnail_url'):
                item['thumbnail'] = result['path']
            else:
                image_paths = [x['path'] for ok, x in results if ok]
                item['images'] = image_paths
        return item
