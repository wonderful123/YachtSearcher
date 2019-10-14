# -*- coding: utf-8 -*-
import re, json, iso4217parse
from opencage.geocoder import OpenCageGeocode
from opencage.geocoder import InvalidInputError, RateLimitExceededError, UnknownError

API_KEY = "a7230342313c439593062d9bd7a4530f"
geocoder = OpenCageGeocode(API_KEY)

def parse_location(query):
    return { 'location': query }
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
            location_data = parse_location(item['location'])
            item['location'] = location_data

        if item.get('listing'):
            print(item['listing'])

        return item

class PreviouslyVisitedWriterPipeline(object):
    FILENAME = 'prev_visited_listings_yachthub.jl'

    def open_spider(self, spider):
        # Read in the previously visited lsitings
        try:
            contents = open(self.FILENAME, "r").read()
            self.prev_visited_listings = [json.loads(str(item)) for item in contents.strip().split('\n')]
        except IOError:
            # If not exists, create the file
            f = open(self.FILENAME, 'w')
            f.write(json.dumps([]))
            f.close()
            self.prev_visited_listings = []

        # Open it again for rewriting
        self.visited_listing_file = open(self.FILENAME, 'w')

    def close_spider(self, spider):
        print(self.prev_visited_listings)
        # self.file.close()
        self.visited_listing_file.close();

    def process_item(self, item, spider):
        url = item["url"]
        # Add url to visited urls
        line = json.dumps(url, ensure_ascii=False, indent=4) + "\n"
        self.prev_visited_listings.append(url)
        self.visited_listing_file.write(line)
        return item

class JsonWriterPipeline(object):
    def open_spider(self, spider):
        pass

    def close_spider(self, spider):
        # self.file = open('items.jl', 'w')
        pass

    def process_item(self, item, spider):
        # line = json.dumps(dict(item), ensure_ascii=False, indent=4) + "\n"
        # self.file.write(line)
        return item
