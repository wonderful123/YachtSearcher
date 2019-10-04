module Scraper
  class ListingSite
    def initialize(options)
      # Default options for each site
      @boat_depth = 0
      @page_depth = 0
      @index_only = true
      @starting_page = 1

      options.each do |key, value|
        self.instance_variable_set("@#{key}".to_sym, value)
      end
    end
  end
end
