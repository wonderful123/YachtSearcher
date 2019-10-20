# -*- coding: utf-8 -*-
import re, json, iso4217parse, datetime
from opencage.geocoder import OpenCageGeocode
from opencage.geocoder import InvalidInputError, RateLimitExceededError, UnknownError
from scraper.database import Database

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

    # Search containing 34' 26", etc
    imperial = re.search('(\d+)\'\s?((\d*)")?', length)
    if imperial:
      obj["imperial"] = imperial.group(0).strip()
      feet = re.search("(\d+)(?=')", obj["imperial"]).group(0)
      inches = re.search('(\d+)(?=")', obj["imperial"])
      inches = inches.group(0) if inches else 0
      obj["total_inches"] = int(feet) * 12 + int(inches)

    elif not imperial:
      # Search containing 34.00 Feet
      imperial = re.search('\d+.?\d+?(?=\s?(?i)feet)', length)
      if imperial:
        l = float(imperial.group(0))
        obj["total_inches"] = int(l) * 12
        feet = round(int(l))
        inches = int(l%12)
        obj["imperial"] = f"{feet}' {inches}\""

    elif not imperial:
      obj["imperial"] = None

    # search for meters string, otherwise calculate from total_inches if available
    m = re.search('(\d+).?(\d*)\s?(?=m)', length)
    if m:
      obj["meters"] = float(m.group(0))
    elif obj.get("total_inches"):
      obj["meters"] = obj["total_inches"] * 0.0254

    return obj

def parse_price(price):
    """Parses price string into currency object

    Parameters
    ----------
    price : string
        String with currency, symbol, etc.
        Can handle "$1.29 Million"

    Returns
    -------
    dict
        Returns dict containing - original, currency code, name, symbol, value

    """
    original = price
    # Check for "million" or "M", etc
    for token in price.split(' '):
      token = token.lower()
      if token in ['million','m','mm']:
        multiplier = 1e6
        amount = float(re.findall("\d+\.\d+", price)[0])
        price = re.sub("\d+\.\d+", str(amount * multiplier), price) # replace price with multiplied amount
        price = re.sub(token, "", price, flags=re.IGNORECASE) # remove token
        price = price.strip()

    # Parses doesn't seem to handle just 'AU'
    price = price.replace('AU','AUD').replace('NZ','NZD').replace('US','USD')
    currency = iso4217parse.parse(price)[0]
    return {
      'original': original,
      'code': currency.alpha3,
      'name': currency.name,
      'symbol': currency.symbols[0],
      'value': float(re.sub("\D", "", price))
    }

class ScraperPipeline(object):
    def process_item(self, item, spider):
        if item.get('length'):
            item['length'] = item['length'].get_collected_values('length')[0]
            lengths = parse_length(item['length'])
            item['length'] = lengths

        if item.get('price'):
            item['price'] = item['price'].get_collected_values('original')[0]
            data = parse_price(item['price'])
            item['price'] = data

        if item.get('location'):
            item['location'] = item['location'].get_collected_values('location')[0]
            # parse location with API - this can be set to false fo`r testing
            if spider.scrape_location == "true":
                location_data = parse_location(item['location'])
                item['location'] = location_data
                item['is_location_scraped'] = 'true' # set flag so location scrape is not done twice later on

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
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d--%H-%M-%S")
        filename = f"data/[{spider.name}]-{timestamp}.jl"
        self.file = open(filename, 'w')

    def close_spider(self, spider):
        self.file.close()

    def process_item(self, item, spider):
        line = json.dumps(dict(item), ensure_ascii=False, indent=4) + "\n"
        self.file.write(line)
        return item
