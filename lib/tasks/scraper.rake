namespace :scraper do
  require 'loader'
  desc "Import data from python scraper"

  task :import do
    loader = ScraperData::Loader.new
    loader.each do |meta, listings|
      process_listings(meta, listings)
    end
  end

  def process_listings(meta, listings)
    listings.each do |listing_data|
      boat, listing, regions = map_data(listing_data)
      puts JSON.pretty_generate boat
    end
  end

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

    boat.delete_if(&p)
    listing.delete_if(&p)
    regions.delete_if(&p)

    return boat, listing, regions
  end
end
