namespace :scraper do
  require 'loader'
  require 'tty-progressbar'
  require 'pastel'

  desc "Import data from python scraper"

  task :import => :environment do
    loader = ScraperData::Loader.new

    progress_bars = setup_progress_bars(loader.file_count)

    # Iterate over over loader file and process the listings
    i = 0
    loader.each do |meta, listings|
      progress_bars[i].update(total: listings.length)
      process_listings(meta, listings, progress_bars[i])
      i += 1
    end
  end

  # Process each listing individually
  def process_listings(meta, listings, progress_bar)
    listings.each do |listing_data|
      boat, listing, regions = map_data(listing_data, meta)
      update_database(meta, boat, listing, regions)

      progress_bar.advance(meta: "%-45s" % "#{meta[:site_name]} - #{meta[:timestamp]}")
    end
  end

  def update_database(meta, boat_data, listing_data, region_data)
    # Check if this listing is new
    existing_listing = Listing.find_by uniq_id: listing_data[:uniq_id]

    if existing_listing
      Boat.update(existing_listing[:boat_id], boat_data)

      check_listing_change(existing_listing, listing_data)
    else # otherwise create a new listing
      site = Site.find_or_create_by(name: meta[:site_name])

      boat = Boat.create(boat_data)

      listing_data[:boat_id] = boat.id
      listing_data[:site_id] = site.id
      listing = Listing.create(listing_data)
    end
  end

  # Checks for changes in listing and records in listing history
  def check_listing_change(existing_listing, listing_data)
    # Skip nil price checks
    if listing_data[:price].nil? || existing_listing[:price].nil?
      return false
    end

    # price change
    if existing_listing[:price] > listing_data[:price].to_f
      did_update = update_listing(existing_listing, listing_data, "price_down")
      print Pastel.new.blue " Price change: #{existing_listing[:price]} to '#{listing_data[:price]}'#{' '*20}\r"
    elsif existing_listing[:price] < listing_data[:price].to_f
      print Pastel.new.blue " Price change: #{existing_listing[:price]} to '#{listing_data[:price]}'#{' '*20}\r"
      did_update = update_listing(existing_listing, listing_data, "price_up")
    end

    # sale status change
    if existing_listing[:sale_status] != listing_data[:sale_status]
      print Pastel.new.cyan " Sale status change: #{existing_listing[:sale_status]} to '#{listing_data[:sale_status]}'#{' '*20}\r"
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

  def setup_progress_bars(total_files)
    # For colours
    pastel = Pastel.new
    green = pastel.green("=")
    yellow = pastel.yellow("=")

    # Main bar
    progress_bar = TTY::ProgressBar::Multi.new("Progress: [:bar] Total files: #{total_files} Total time::elapsed", total: total_files, width: 60, complete: yellow)
    progress_bar.on(:stopped) { progress_bar.update(hide_cursor: false) }

    # Build array of child progress bars
    listing_bars = []
    (1..total_files + 1).each do |n|
      bar = progress_bar.register("(%02d/%02d) [:bar] :meta :percent   \t Listings: :current/:total ETA::eta Time::elapsed" % n, total_files, total: 100, width: 30, complete: green, hide_cursor: true)
      listing_bars << bar
    end

    return listing_bars
  end

  # Map the data to hashes for the database
  def map_data(data, meta)
    # Convert to open struct for easier dot notation
    d = JSON.parse data.to_json, object_class: OpenStruct

    # Check if location given as string or extended data
    location = d.location.instance_of?(String) ? d.location : (d.location.location rescue nil)

    # First found data available? otherwise set to timestamp provided by file
    first_found = d.first_found || meta[:timestamp]

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
      first_found: first_found,
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
      images: d.images,
      first_found: first_found,
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
