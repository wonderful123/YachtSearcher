module Scraper
  class Geocode
    require 'geocoder'

    API_KEY = "a7230342313c439593062d9bd7a4530f"

    Geocoder.configure(lookup: :opencagedata, api_key: API_KEY)

    # Returns data with symbols:
    # country, continent, state, state_code, :town, :formatted, :regions[array], lat, lng
    def self.location(location_string)
      # "Europe" in location seems to give bad result so ignore
      location_string.gsub!('Europe', '')

      results = Geocoder.search(location_string)
      results = results.first.data

      data = {}
      c = results["components"]

      # extract all data from JSON response
      data[:country] = c["country"]
      data[:continent] = c["continent"]
      data[:state] = c["state"]
      data[:state_code] = c["state_code"]
      data[:city] = c["city"] || c["town"] || c["county"]
      data[:formatted] = location_string
      data[:lat] = results["geometry"]["lat"]
      data[:lng] = results["geometry"]["lng"]

      # Extract regions data.
      data[:regions] = []
      results["annotations"]["UN_M49"]["regions"].each do |region, code|
        # Format to title case
        r = region.gsub('_',' ').split(/(\W)/).map(&:capitalize).join
        # Add region but ignore 2 character country code and "World"
        data[:regions] << r if r.length != 2 && r != "World"
      end

      return data
    end
  end
end
