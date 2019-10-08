# Options:
#   Website_type: 'yachthub'
#   options: Hash of options
#       - "boat_depth: n" - number of boats to scrape off first page
#       - "page_depth: n" - number of pages to scrape
#       - "index_only: true" - only scrape information off index page, not deep links

require 'nokogiri'
require_relative 'sites/yachthub'

module Scraper
  class Scrape
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

    def scrape_index_page(url)
      @site.scrape_index_page(url)
    end

    def get_index_pages
      @site.get_index_pages
    end
  end
end
