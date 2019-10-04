require 'geocoder'

module Scraper
  class Geocode
    API_KEY = "a7230342313c439593062d9bd7a4530f"

    Geocoder.configure(lookup: :opencagedata, api_key: API_KEY)

    # Returns data with symbols:
    # country, continent, state, state_code, :town, :formatted, :regions[array], latitude, longitude
    def self.location(location_string)
      results = Geocoder.search(location_string)
      results = results&.first&.data

      data = {}
      data.default = ""

      data[:formatted] = location_string #c["formatted"]

      if results == nil then return data end

      data[:latitude] = results["geometry"]["lat"]
      data[:longitude] = results["geometry"]["lng"]

      c = results["components"]
      # Some general locations like "Europe" won't provide this info so check
      if c["_type"] != "unknown" then
        # extract all data from JSON response
        data[:country] = c["country"]
        data[:continent] = c["continent"]
        data[:state] = c["state"]
        data[:state_code] = c["state_code"]
        data[:city] = c["city"] || c["town"] || c["county"]

        # Extract regions data.
        data[:regions] = []
          results["annotations"]["UN_M49"]["regions"].each do |region, code|
          # Format to title case
          r = region.gsub('_',' ').split(/(\W)/).map(&:capitalize).join
          # Add region but ignore 2 character country code and "World"
          data[:regions] << r if r.length != 2 && r != "World"
        end
      end

      return data
    end
  end
end
