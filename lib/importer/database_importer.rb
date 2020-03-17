# frozen_string_literal: true

require 'pastel'

# Responsible for taking hash of processed listing data, checking how to update
# rails database, then finally adding to database.
class DatabaseImporter
  # Class instance method to update or insert data
  def self.insert(meta, boat_data, listing_data, _region_data)
    # Check if this listing is already in database
    existing_listing = Listing.find_by uniq_id: listing_data[:uniq_id]

    # Update existing listing
    if existing_listing
      Boat.update(existing_listing[:boat_id], boat_data)
      check_listing_change(existing_listing, listing_data)
    else # otherwise create a new listing
      new_listing(meta, boat_data, listing_data)
    end
  end

  # Creates new listing
  def self.new_listing(meta, boat_data, listing_data)
    site = Site.find_or_create_by(name: meta[:site_name])
    boat = Boat.create(boat_data)
    # Associate boat and listing with listing
    listing_data[:boat_id] = boat.id
    listing_data[:site_id] = site.id
    Listing.create(listing_data)
  end

  # Checks for changes in listing and records in listing history
  def self.check_listing_change(existing_listing, listing_data)
    # Skip blank prices
    if !listing_data[:price] || !existing_listing[:price]
      return false
    end

    # price change
    if existing_listing[:price] > listing_data[:price].to_f
      did_update = update_listing(existing_listing, listing_data, 'price_down')
      print Pastel.new.blue " Price change: #{existing_listing[:price]} to '#{listing_data[:price]}'#{' '*20}\r"
    elsif existing_listing[:price] < listing_data[:price].to_f
      print Pastel.new.blue " Price change: #{existing_listing[:price]} to '#{listing_data[:price]}'#{' '*20}\r"
      did_update = update_listing(existing_listing, listing_data, 'price_up')
    end

    # sale status change
    if existing_listing[:sale_status] != listing_data[:sale_status]
      print Pastel.new.cyan " Sale status change: #{existing_listing[:sale_status]} to '#{listing_data[:sale_status]}'#{' '*20}\r"
      did_update = update_listing(existing_listing, listing_data, 'sale_status')
    end

    return did_update
  end

  # Create history then update existing listing with new data
  def self.update_listing(existing_listing, listing_data, change_type)
    History.create({
      price: existing_listing[:price].to_f,
      sale_status: existing_listing[:sale_status],
      change_date: Time.now,
      change_type: change_type,
      listing_id: existing_listing[:id]
    })

    existing_listing.update(listing_data)
  end
end
