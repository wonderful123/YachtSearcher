# frozen_string_literal: true

# Class is responsible for serializing listing data into a hash that can be
# inserted/updated into rails database.
class Serializer
  # Map the data to hashes for the database
  #
  # Takes in listing data and site meta (site name, timestamp)
  # Returns hash with [boat, listing, regions]
  def self.serialize(listing_data, meta)
    # Convert to open struct for easier dot notation
    d = JSON.parse listing_data.to_json, object_class: OpenStruct

    # Check if location given as string or extended data with latitude, etc
    # Also convert location hash to OpenStruct so dot notation can be used
    if d.location.instance_of?(String)
      location = d.location
    elsif d.location.nil?
      location = nil
    else
      location = OpenStruct.new(d.location)
    end

    # First found data available? otherwise set to timestamp provided by file
    first_found = d.first_found || meta[:timestamp]

    boat = serialize_boat(d, location, first_found)
    listing = serialize_listing(d, first_found)
    regions = serialize_regions(d)

    # Remove any blank values
    boat = remove_blank_values(boat)
    listing = remove_blank_values(listing)
    regions = remove_blank_values(regions)

    [boat, listing, regions]
  end

  private

  # Maps data to boat hash
  def self.serialize_boat(d, location, first_found)
    # Use rescue on nested values to stop errors
    {
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
      location: location.instance_of?(String) ? d.location : (d.location.location rescue nil),
      city: (location.city rescue nil),
      country: (location.country rescue nil),
      state: (location.state rescue nil),
      state_code: (location.state_code rescue nil),
      longitude: (location.longitude rescue nil),
      latitude: (location.latitude rescue nil),
      description: d.description,
      full_description: d.full_description,
      sale_status: d.sale_status,
      thumbnail: d.thumbnail,
      make: d.make,
      model: d.model,
      hull_material: d.hull_material,
      first_found: first_found,
    }
  end

  def self.serialize_listing(d, first_found)
    {
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
      first_found: first_found
    }
  end

  def self.serialize_regions(listing_data)
    listing_data.location.regions rescue []
  end

  # Recursively filters out nil (or blank - e.g. ""
  # if exclude_blank: true is passed as an option) records from a Hash
  def self.remove_blank_values(hash)
    hash.each do |k, v|
      if v.blank? && v != false
        hash.delete(k)
      elsif v.is_a?(Hash)
        hash[k] = remove_blank_values!(v)
      end
    end
  end
end
