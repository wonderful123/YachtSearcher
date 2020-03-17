# frozen_string_literal: true

require 'jsonl'
require 'date'

# Module for loading scraper data from files then moving to archive location
module ScraperData
  # Loader class loads the files from the scraper data directory then moves
  # completed imports to the archive directory.
  # Class yields an each iterator for sequential access to each file to process.
  # Also a file_count to know how many files to process
  class Loader
    DATA_LOCATION = 'scraper/data'
    ARCHIVE_LOCATION = '/archived/'

    # Can access file_count outside class to know how many files to process
    attr_reader :file_count

    # Sets up file access to process files.
    #
    # @param data_location [String] default: DATA_LOCATION
    # Can set a different data location if required
    def initialize(data_location = DATA_LOCATION)
      @data_location = data_location
      @files = unprocessed_files
      @file_count = @files.length
      @archive_location = data_location + ARCHIVE_LOCATION
      FileUtils.mkdir_p @archive_location
    end

    # Returns each iterator for each file
    # Yields meta: { site_name: string, timestamp: datetime }
    #        data: array of boat data
    def each
      @files.each do |file|
        meta = filename_meta(file)
        yield meta, load(file)
        archive(file)
      end
    end

    private

    # Returns a sorted array of all files to process
    def unprocessed_files
      Dir.glob(@data_location + '/*.jl').sort
    end

    # Returns the site name and timestamp from filename
    def filename_meta(file)
      site_name = file[/\[(.*)\]/, 1]

      timestamp = file[/\d{4}.*\d/, 0]
      pattern = '%Y-%m-%d--%H-%M-%S'
      timestamp = DateTime.strptime(timestamp, pattern)

      { site_name: site_name, timestamp: timestamp }
    end

    # Returns an array of objects containing listing data for the current file
    def load(file)
      data = File.read(file)
      JSONL.parse(data)
    end

    # Moves processed file to archive location
    def archive(file)
      FileUtils.mv(file, @archive_location)
    end
  end
end
