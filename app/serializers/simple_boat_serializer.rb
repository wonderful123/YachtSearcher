class SimpleBoatSerializer
  include FastJsonapi::ObjectSerializer
  set_type :boat
  set_key_transform :dash
  # has_many :listings
  attributes :length_inches, :year, :title, :make, :model, :price, :thumbnail, :description

  attribute :description do |object|
    object.description.to_s.truncate(80)
  end
end
