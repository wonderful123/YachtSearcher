# require "FileUtils"
require 'JSONL'
require 'date'

# Module loads the files in the scraper directory them to the archive directory.
# Yield an iterator for each file.

module ScraperData
  class Loader
    attr_reader :file_count

    # Give the location of scraper data.
    def initialize(data_location = 'scraper/data')
      @data_location = data_location
      @files = get_files
      @file_count = @files.length
      @archive_location = data_location + '/archived/'
      FileUtils.mkdir_p @archive_location
    end

    def each
      # Can iterate over each file
      # Yields meta: { site_name: string, timestamp: datetime }
      #        data: array of boat data
      @files.each do |file|
        meta = get_meta_from_filename(file)
        yield meta, load(file)
        archive(file)
      end
    end

    def get_files
      # return a sorted array of all files to process
      Dir.glob(@data_location + '/*.jl').sort
    end

    def get_meta_from_filename(file)
      # Get the site name and timestamp from filename
      site_name = file[/\[(.*)\]/, 1]

      timestamp = file[/\d{4}.*\d/, 0]
      pattern = "%Y-%m-%d--%H-%M-%S"
      timestamp = DateTime.strptime(timestamp, pattern)

      return { site_name: site_name, timestamp: timestamp }
    end

    def load(file)
      # Return array of loaded objects
      data = File.read(file)
      JSONL.parse(data)
    end

    def archive(file)
      FileUtils.mv(file, @archive_location)
    end

  end
end
