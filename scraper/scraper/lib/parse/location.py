from opencage.geocoder import OpenCageGeocode
from opencage.geocoder import InvalidInputError, RateLimitExceededError, \
    UnknownError

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
            # Some general locations like "Europe" won't provide this info
            if c.get("_type") != "unknown":
                # extract all data from JSON response
                data['country'] = c.get('country', "")
                data['continent'] = c.get('continent', "")
                data['state'] = c.get("state", "")
                data['state_code'] = c.get("state_code", "")
                data['city'] = c.get("city", False) or c.get("town", False) \
                    or c.get("county", "")

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
