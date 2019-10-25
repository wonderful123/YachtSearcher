namespace :scraper do
  require 'loader'
  desc "Import data from python scraper"

  IMAGES_DIR = 'scraper/data/images/'

  task :import do
    loader = ScraperData::Loader.new
    loader.each do |meta, listings|
      process_listings(meta, listings)
    end
  end

  def process_listings(meta, listings)
    listings.each do |listing_data|
      boat, listing = map_data(listing_data)
    end
  end

  def map_data(data)
    # Convert to open struct for easier dot notation
    d = JSON.parse data.to_json, object_class: OpenStruct

    # Use rescue on nested values to stop errors
    boat = {
      length: (d.length.total_inches rescue nil),
      year: d.year,
      price: (d.price.value rescue nil),
      title: d.title,
      location: d.location,
      description: d.description,
      sale_status: d.sale_status,
      thumbnail: IMAGES_DIR + d.thumbnail,
      make: d.make,
      model: d.model,
      hull_material: d.hull_material,
      location: d.location,
      country: (d.location.country rescue nil),
      city: (d.location.city rescue nil),
    }

    listing = {
      url: d.url,
      price: d.price,
      uniq_id: d.uniq_id,
      title: d.title,
      description: d.description,
      full_description: d.full_description,
      sale_status: d.sale_status,
      thumbnail: IMAGES_DIR + d.thumbnail
    }

    return boat, listing
  end
end
