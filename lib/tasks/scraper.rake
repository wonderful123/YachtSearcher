# frozen_string_literal: true

namespace :scraper do
  require 'importer/importer'

  desc 'Import data from python scraper'

  task import: :environment do
    importer = ScraperData::Importer.new
    importer.start
  end
end
