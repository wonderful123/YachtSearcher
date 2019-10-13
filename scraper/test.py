# import json
#
# contents = open('prev_visited_listings.jl', "r").read()
# prev_visited_listings = [json.loads(str(item)) for item in contents.strip().split('\n')]
#
# print(prev_visited_listings)

from opencage.geocoder import OpenCageGeocode
from opencage.geocoder import InvalidInputError, RateLimitExceededError, UnknownError

from pprint import pprint

API_KEY = "a7230342313c439593062d9bd7a4530f"
geocoder = OpenCageGeocode(API_KEY)

def parse_location(query):
    try:
        results = geocoder.geocode(query)
        if results and len(results):
            r = results[0]
            data = {
                'formatted': r['formatted'],
                'latitude': r['geometry']['lat'],
                'longitude': r['geometry']['lng'],
            }
            c = r["components"]
            # Some general locations like "Europe" won't provide this info so check
            if c["_type"] != "unknown":
                # extract all data from JSON response
                data['country'] = c["country"]
                data['continent'] = c["continent"]
                data['state'] = c["state"]
                data['state_code'] = c["state_code"]
                data['city'] = c["city"] or c["town"] or c["county"]

            # Extract regions data.
            data['regions'] = []
            for region in r["annotations"]["UN_M49"]["regions"]:
                # Format to title case
                region = region.title()
                # Add region but ignore 2 character country code and "World"
                if (len(region) != 2 and region != "World"):
                    data['regions'].append(region)
            print("DATA ", data)
            return data
            # 11 Rue Sauteyron, 33800 Bordeaux, Frankreich
    except RateLimitExceededError as ex:
        print(ex)

parse_location('newport, nsw, australia')
      # c = results["components"]
      # # Some general locations like "Europe" won't provide this info so check
      # if c["_type"] != "unknown" then
      #   # extract all data from JSON response
      #   data[:country] = c["country"]
      #   data[:continent] = c["continent"]
      #   data[:state] = c["state"]
      #   data[:state_code] = c["state_code"]
      #   data[:city] = c["city"] || c["town"] || c["county"]
      #
      #   # Extract regions data.
      #   data[:regions] = []
      #     results["annotations"]["UN_M49"]["regions"].each do |region, code|
      #     # Format to title case
      #     r = region.gsub('_',' ').split(/(\W)/).map(&:capitalize).join
      #     # Add region but ignore 2 character country code and "World"
      #     data[:regions] << r if r.length != 2 && r != "World"
