# -*- coding: utf-8 -*-
import re, json, iso4217parse, datetime
from opencage.geocoder import OpenCageGeocode
from opencage.geocoder import InvalidInputError, RateLimitExceededError, UnknownError

API_KEY = "a7230342313c439593062d9bd7a4530f"
geocoder = OpenCageGeocode(API_KEY)

def parse_location(query):
    try:
        results = geocoder.geocode(query)
        if results and len(results):
            r = results[0]
            data = {
                'location': query,
                'formatted': r['formatted'],
                'latitude': r['geometry']['lat'],
                'longitude': r['geometry']['lng'],
            }
            c = r.get("components")
            # Some general locations like "Europe" won't provide this info so check
            if c.get("_type") != "unknown":
                # extract all data from JSON response
                data['country'] = c.get('country', "")
                data['continent'] = c.get('continent', "")
                data['state'] = c.get("state", "")
                data['state_code'] = c.get("state_code", "")
                data['city'] = c.get("city", False) or c.get("town", False) or c.get("county", "")

            # Extract regions data.
            data['regions'] = []
            for region in r["annotations"]["UN_M49"]["regions"]:
                # Format to title case
                region = region.title()
                # Add region but ignore 2 character country code and "World"
                if (len(region) != 2 and region != "World"):
                    data['regions'].append(region)
            return data
    except RateLimitExceededError as ex:
        print(ex)

# Accepts any string containing metric or imperial length
# Return dict with meters, imperial string and total inches
def parse_length(length):
    obj = {}
    m = re.search('(\d+).?(\d*)\s?(?=m)', length)
    obj["meters"] = float(m.group(0)) if m else None
    imperial = re.search('(\d+)\'\s?((\d*)")?', length)
    obj["imperial"] = imperial.group(0) if imperial else None
    if imperial:
        feet = re.search("(\d+)(?=')", obj["imperial"]).group(0)
        inches = re.search('(\d+)(?=")', obj["imperial"])
        inches = inches.group(0) if inches else 0
        obj["total_inches"] = int(feet) * 12 + int(inches)
    else:
        obj["total_inches"] = None

    return obj

class ScraperPipeline(object):
    def process_item(self, item, spider):
        if item.get('length'):
            item['length'] = item['length'].get_collected_values('length')[0]
            lengths = parse_length(item['length'])
            item['length'] = lengths

        if item.get('price'):
            original = item['price'].get_collected_values('original')[0]
            price = original.replace('AU','AUD').replace('NZ','NZD').replace('US','USD')
            currency = iso4217parse.parse(price)[0]
            data = {
              'original': original,
              'code': currency.alpha3,
              'name': currency.name,
              'symbol': currency.symbols[0],
              'value': float(re.sub("\D", "", price))
            }
            item['price'] = data

        if item.get('location'):
            item['location'] = item['location'].get_collected_values('location')[0]
            # parse location with API - this can be set to false fo`r testing
            if spider.scrape_location == "true":
                location_data = parse_location(item['location'])
                item['location'] = location_data
                item['is_location_scraped'] = True # set flag so location scrape is not done twice later on

        if item.get('listing'):
            print(item['listing'])

        return item

import sqlite3
from sqlite3 import Error

class DatabasePipeline(object):
    def create_connection(self, db_file):
        """ create a database connection to the SQLite database
            specified by db_file
        :param db_file: database file
        :return: Connection object or None
        """
        self.conn = None
        try:
            self.conn = sqlite3.connect("./data/" + db_file + ".db")
        except Error as e:
            print(e)

        return self.conn

    def create_table(self):
        sql = ''' CREATE TABLE IF NOT EXISTS listing_data (
          listing_id INTEGER PRIMARY KEY,
          url TEXT NOT NULL UNIQUE,
          is_deep_scraped TEXT,
          is_location_scraped TEXT
          ) '''
        cur = self.conn.cursor()
        cur.execute(sql)

    def flag_listing_data(self, url, field):
        # 2 queries to accomplish upsert
        sql = f''' UPDATE listing_data
            SET {field} = True
            WHERE url = "{url}" '''
        cur = self.conn.cursor()
        cur.execute(sql)
        sql = f''' INSERT OR IGNORE INTO listing_data
            (url, {field})
            VALUES ( "{url}", True ) '''
        cur.execute(sql)
        self.conn.commit()

    def open_spider(self, spider):
        self.create_connection(spider.name)
        self.create_table()

    def close_spider(self, spider):
        self.conn.close()

    def process_item(self, item, spider):
        # Remove key if available then flag the data in database
        if item.pop('is_deep_scraped', False):
            self.flag_listing_data(item['url'], 'is_deep_scraped')
        if item.pop('is_location_scraped', False):
            self.flag_listing_data(item['url'], 'is_location_scraped')

        return item

class JsonItemWriterPipeline(object):
    def open_spider(self, spider):
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d--%H-%M-%S")
        filename = f"data/[{spider.name}]-{timestamp}.jl"
        self.file = open(filename, 'w')

    def close_spider(self, spider):
        self.file.close()

    def process_item(self, item, spider):
        line = json.dumps(dict(item), ensure_ascii=False, indent=4) + "\n"
        self.file.write(line)
        return item
