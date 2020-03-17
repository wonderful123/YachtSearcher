# frozen_string_literal: true

require 'pastel' # for coloured output
require 'tty-progressbar'

# Class shows progress bar output for file processing
class ProgressBars
  # Sets up progress bars for importer status output
  # Accepts total number of files that will create the bars
  #
  # @return [Array] an array of child progress bars to advance
  def initialize(total_files)
    # Output colours
    @pastel = Pastel.new
    @progress_bars = setup_progress_bars(total_files)
  end

  # Progress bar needs to know how many listings to count
  #
  # @param child_bar [Int] Child bar number in array
  # @param count [Int] Number of listings
  def update(child_bar, count)
    @progress_bars[child_bar].update(total: count)
  end

  # Advances progress bar
  def advance(child_bar, site_name, timestamp)
    @progress_bars[child_bar].advance(
      meta: '%-45s' % "#{site_name} - #{timestamp}"
    )
  end

  private

  def setup_progress_bars(total_files)
    # Main bar
    yellow = @pastel.yellow('=')
    progress_bar = TTY::ProgressBar::Multi.new(
      "Progress: [:bar] Total files: #{total_files} Total time::elapsed",
      total: total_files, width: 60, complete: yellow
    )
    progress_bar.on(:stopped) { progress_bar.update(hide_cursor: false) }

    setup_child_progress_bars(progress_bar, total_files)
  end

  # Build array of child progress bars
  def setup_child_progress_bars(progress_bar, total_files)
    green = @pastel.green('=')
    child_bars = []
    (1..total_files).each do |n|
      bar = progress_bar.register(
        "(%02d/%02d) [:bar] :meta :percent   \t Listings: :current/:total ETA::eta Time::elapsed" % [n, total_files],
        total: 100,
        width: 30,
        complete: green,
        hide_cursor: true
      )
      child_bars << bar
    end

    child_bars
  end
end
