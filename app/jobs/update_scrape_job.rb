require 'scraper'
require 'geocode'

class UpdateScrapeJob < ApplicationJob
  include SuckerPunch::Job
  queue_as :default

  # Arg:update_existing = true will overwrite existing listing information.
  def perform(site, options={}, update_existing=false)
    scraper = Scraper::Scrape.new(site.name, options)
    boat_listings = scraper.scrape_listings

    boat_listings.each do |l|
      boat_data = {
        :length => l[:length],
        :year => l[:year],
        :price => l[:price],
        :title => l[:title],
        :location => l[:location],
        :description => l[:description],
        :sale_status => l[:sale_status],
      }

      listing_data = {
        :url => l[:url],
        :price => l[:price],
        :uniq_id => l[:uniq_id],
        :title => l[:title],
        :description => l[:description],
        :sale_status => l[:sale_status],
      }

      # Check if this listing is new
      existing_listing = Listing.find_by uniq_id: l[:uniq_id]

      if existing_listing
        if existing_listing[:boat_id] == 34
          puts "*-" * 20
          p existing_listing
          p boat_data
          puts "*-" * 20
        end
        puts "Boat already in database #{l[:uniq_id]} - UPDATING..."
        Boat.update(existing_listing[:boat_id], boat_data)

        # Check if listing is updated and record history of changes
        update_listing(existing_listing, listing_data)
      else # otherwise create a new listing
        # Geocode location string
        loc = Scraper::Geocode.location l[:location]

        boat = Boat.create(
          **boat_data,
          :location => loc[:formatted],
          :longitude => loc[:longitude],
          :latitude => loc[:latitude],
          :city => loc[:city],
          :state => loc[:state],
          :state_code => loc[:state_code],
          :country => loc[:country],
          :continent => loc[:continent],
          :first_found => Time.now
        )

        listing = Listing.create(
          **listing_data,
          :first_found => Time.now,
          :boat_id => boat.id,
          :site_id => site.id,
        )

        # # include other region locations if unique
        # region_list = loc[:regions]
        # region_list |= [loc[:country]]
        # region_list |= [loc[:state]]
        # region_list |= [loc[:continent]]
        # region_list |= [loc[:state_code]]
        #
        # # add each region
        # region_list.each do |region|
        #   boat.regions << Region.find_or_create_by(region: region) if region != nil
        # end

        # attach thumbnail image
        boat.thumbnail.attach(io: open(l[:thumbnail]), filename: "thumbnail-#{l[:uniq_id]}.jpg")
      end
    end
  end

  def update_listing(existing_listing, listing_data)
    # Record if price or sale_status changed
    if existing_listing[:price] != listing_data[:price].to_f ||
       existing_listing[:sale_status] != existing_listing[:sale_status]

       History.create({
         :price => existing_listing[:price].to_f,
         :sale_status => existing_listing[:price],
         :change_date => Time.now,
         :listing_id => existing_listing[:id]
       })
     end

    # Update existing listing with new values
    existing_listing.update(listing_data)
  end
end
