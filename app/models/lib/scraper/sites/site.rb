module Scraper
  class Site
    # Default options for each site
    @boat_depth = 0
    @page_depth = 1
    @index_only = true

    def initialize(options)
      options.each do |key, value|
        self.instance_variable_set("@#{key}".to_sym, value)
      end
    end
  end
end
