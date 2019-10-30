namespace :scraper do
  require 'loader'

  desc "Import data from python scraper"

  task :import => :environment do
    loader = ScraperData::Loader.new

    # Iterate over over loader file and process the listings
    loader.each do |meta, listings|
      puts "Processing listing data: #{meta[:site_name]} - #{meta[:timestamp]}"
      process_listings(meta, listings)
    end
  end

  # Process each listing individually
  def process_listings(meta, listings)
    listings.each do |listing_data|
      boat, listing, regions = map_data(listing_data)
      update_database(meta, boat, listing, regions)
    end
  end

  def update_database(meta, boat_data, listing_data, region_data)
    # Check if this listing is new
    existing_listing = Listing.find_by uniq_id: listing_data[:uniq_id]

    if existing_listing
      Boat.update(existing_listing[:boat_id], boat_data)

      check_listing_change(existing_listing, listing_data)
    else # otherwise create a new listing
      site = Site.where(name: meta[:site_name]).first

      boat_data[:first_found] = meta[:timestamp]
      boat = Boat.create(boat_data)

      listing_data[:boat_id] = boat.id
      listing_data[:site_id] = site.id
      listing_data[:first_found] = meta[:timestamp]
      listing = Listing.create(listing_data)
    end
  end

  # Checks for changes in listing and records in listing history
  def check_listing_change(existing_listing, listing_data)
    if listing_data[:price].nil? || existing_listing[:price].nil?
      return false
    end

    # price change
    if existing_listing[:price] > listing_data[:price].to_f
      did_update = update_listing(existing_listing, listing_data, "price_down")
    elsif existing_listing[:price] < listing_data[:price].to_f
      did_update = update_listing(existing_listing, listing_data, "price_up")
    end

    # sale status change
    if existing_listing[:sale_status] != listing_data[:sale_status]
      puts "Sale Status Change #{existing_listing[:sale_status]} != '#{listing_data[:sale_status]}'"
      did_update = update_listing(existing_listing, listing_data, "sale_status")
    end

    return did_update
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

  # Map the data to hashes for the database
  def map_data(data)
    # Convert to open struct for easier dot notation
    d = JSON.parse data.to_json, object_class: OpenStruct

    # Check if location given as string or extended data
    location = d.location.instance_of?(String) ? d.location : (d.location.location rescue nil)

    # Use rescue on nested values to stop errors
    boat = {
      length_inches: (d.length.total_inches rescue nil),
      length_imperial: (d.length.imperial rescue nil),
      length_meters: (d.length.meters rescue nil),
      year: d.year,
      price: (d.price.value rescue nil),
      price_code: (d.price.code rescue nil),
      price_formatted: (d.price.formatted rescue nil),
      price_name: (d.price.name rescue nil),
      price_symbol: (d.price.symbol rescue nil),
      title: d.title,
      location: location,
      city: (d.location.city rescue nil),
      country: (d.location.country rescue nil),
      state: (d.location.state rescue nil),
      state_code: (d.location.state_code rescue nil),
      longitude: (d.location.longitude rescue nil),
      latitude: (d.location.latitude rescue nil),
      description: d.description,
      full_description: d.full_description,
      sale_status: d.sale_status,
      thumbnail: d.thumbnail,
      make: d.make,
      model: d.model,
      hull_material: d.hull_material,
    }

    listing = {
      url: d.url,
      price: (d.price.value rescue nil),
      price_code: (d.price.code rescue nil),
      price_formatted: (d.price.formatted rescue nil),
      price_name: (d.price.name rescue nil),
      price_symbol: (d.price.symbol rescue nil),
      uniq_id: d.uniq_id,
      title: d.title,
      description: d.description,
      full_description: d.full_description,
      sale_status: d.sale_status,
      thumbnail: d.thumbnail,
      images: d.images
    }

    regions = (d.location.regions rescue [])

    # This code removes all nil key, value pairs
    p = proc do |_, v|
      v.delete_if(&p) if v.respond_to? :delete_if
      v.nil? || v.respond_to?(:"empty?") && v.empty?
    end

    boat = remove_blank_values(boat)
    listing = remove_blank_values(listing)
    regions = remove_blank_values(regions)

    return boat, listing, regions
  end

  # Recursively filters out nil (or blank - e.g. "" if exclude_blank: true is passed as an option) records from a Hash
  def remove_blank_values(hash)
    hash.each do |k, v|
      if v.blank? && v != false
        hash.delete(k)
      elsif v.is_a?(Hash)
        hash[k] = remove_blank_values!(v)
      end
    end
  end
end
