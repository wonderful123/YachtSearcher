require 'scraper'
require 'geocode'

class ScrapeIndexPageJob < ApplicationJob
  include SuckerPunch::Job
  workers 1
  queue_as :default

  def perform(index_url, site, options)
    scraper = Scraper::Scrape.new(site.name, options)
    boat_listings = scraper.scrape_index_page(index_url)

    boat_listings.each do |listing|
      # Create boat and listing objects with information scraped
      boat_data, listing_data = build_data_objects(listing)

      # Check if this listing is new
      existing_listing = Listing.find_by uniq_id: listing[:uniq_id]

      if existing_listing

        puts "Boat already in database [#{listing[:uniq_id]}] - UPDATING..."
        Boat.update(existing_listing[:boat_id], boat_data)

        # Check if listing should be updated and record history of changes
        check_listing_change(existing_listing, listing_data)

      else # otherwise create a new listing
        # Merge in the geocode data
        boat_data.merge! geocode_data(listing[:location])

        # Create boat and listing
        boat = Boat.create(**boat_data, :first_found => Time.now)

        Listing.create(
          **listing_data,
          :first_found => Time.now,
          :boat_id => boat.id,
          :site_id => site.id,
        )

        # attach thumbnail image
        boat.thumbnail.attach(io: open(listing[:thumbnail]), filename: "thumbnail-#{listing[:uniq_id]}.jpg")
      end
    end
  end

  # Build boat and listing from scraped listing data
  def build_data_objects(l)
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

    return boat_data, listing_data
  end

  def geocode_data(location)
    # Geocode location string
    loc = Scraper::Geocode.location location

    return {
      :location => loc[:formatted],
      :longitude => loc[:longitude],
      :latitude => loc[:latitude],
      :city => loc[:city],
      :state => loc[:state],
      :state_code => loc[:state_code],
      :country => loc[:country],
      :continent => loc[:continent],
    }
  end

  # Checks for changes in listing and records in listing history
  def check_listing_change(existing_listing, listing_data)
    # price change
    if existing_listing[:price] > listing_data[:price].to_f
      update_listing(existing_listing, listing_data, "price_down")
    elsif existing_listing[:price] < listing_data[:price].to_f
      update_listing(existing_listing, listing_data, "price_up")
    end

    # sale status change
    if existing_listing[:sale_status] != listing_data[:sale_status]
      update_listing(existing_listing, listing_data, "sale_status")
    end
  end

  # Create history then update existing listing with new data
  def update_listing(existing_listing, listing_data, change_type)
     History.create({
       :price => existing_listing[:price].to_f,
       :sale_status => existing_listing[:sale_status],
       :change_date => Time.now,
       :change_type => change_type,
       :listing_id => existing_listing[:id]
     })

     existing_listing.update(listing_data)
  end
end
