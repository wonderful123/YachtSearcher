require 'scraper'

class GetIndexPagesJob < ApplicationJob
  include SuckerPunch::Job
  queue_as :default

  def perform(site, options={})
    scraper = Scraper::Scrape.new(site.name, options)
    index_pages = scraper.get_index_pages

    index_pages.each do |page|
      ScrapeIndexPageJob.perform_async(page, site, { page_depth: 0 })
    end
  end
end
