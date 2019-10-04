# Options:
#   Website_type: 'yachthub'
#   options: Hash of options
#       - "boat_depth: n" - number of boats to scrape off first page
#       - "page_depth: n" - number of pages to scrape
#       - "index_only: true" - only scrape information off index page, not deep links
module Scraper
  require 'geocode'
  require 'nokogiri'
  require 'sites/yachthub'

  class Scraper
    def initialize(website_type, options)
      case website_type
      when 'YachtHub'
          @site = Yachthub.new(options)
        else
          fail ArgumentError, 'Not a valid website to scrape', caller
      end
    end

    def scrape_listings
      @site.scrape
    end
  end
end
