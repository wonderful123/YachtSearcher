class ScrapeListingsJob < ApplicationJob
  include SuckerPunch::Job
  workers 1

  queue_as do
    # Generate queue name by getting the first listing and using the site name
    # listing = self.arguments.first
    # site = Site.find_by(listing_id: listing.id)
    # site.name.parameterize.to_sym
    self.arguments.to_s+"queue".to_sym, size: 1
  end


  def perform(listings)
    puts "job start #{listings}"
    sleep 5
    puts "job end #{listings}"
  end
end
