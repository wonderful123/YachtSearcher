# frozen_string_literal: true

require_relative 'loader' # scraper data loader
require_relative 'progress_bars'
require_relative 'serializer'
require_relative 'database_importer'

module ScraperData
  # Class is responsible for importing scraped data files from scrapy.
  # Files are loaded and archived through the Loader class
  class Importer
    # Initialize creates the file loader and progress bar.
    # start method is called to start the import
    def initialize
      # Get list of unprocessed files to iterate over
      @loader = ScraperData::Loader.new

      # Progress bar setup
      @progress_bars = ProgressBars.new(@loader.file_count)
    end

    # Starts the import interation over the files to process
    # Meta includes the site name and timestamp of scrape
    def start
      # Iterate over over loader files and process the listings
      file_num = 0
      @loader.each do |meta, listings|
        @progress_bars.update(file_num, listings.length)
        process_listings(meta, listings, file_num)
        file_num += 1
      end
    end

    private

    # Processes each listing in file
    def process_listings(meta, listings, current_progress_bar)
      listings.each do |listing_data|
        boat, listing, regions = Serializer.serialize(listing_data, meta)

        DatabaseImporter.insert(meta, boat, listing, regions)

        @progress_bars.advance(
          current_progress_bar,
          meta[:site_name],
          meta[:timestamp]
        )
      end
    end
  end
end
