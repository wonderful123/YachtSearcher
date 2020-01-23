class SimpleBoatSerializer
  include FastJsonapi::ObjectSerializer
  set_type :boat
  set_key_transform :dash
  has_many :listings
  attributes :length_inches, :year, :title, :make, :model, :price, :thumbnail,
             :description, :price_symbol, :location, :first_found, :images,
             :total_images

  attribute :description do |object|
    object.description.to_s.truncate(100)
  end

  # images taken from first listing
  # only return amount requested otherwise all
  attribute :images do |object, params|
    images = object.listings.first.images
    unless params[:thumbnails].nil?
      image_count = params[:thumbnails].to_i - 1
      images = [0..image_count]
    end

    images
  end

  attribute :total_images do |object|
    object.listings.first.images.length
  end
end
