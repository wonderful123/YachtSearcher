class MapSerializer
  include FastJsonapi::ObjectSerializer
  set_type :boat
  set_key_transform :dash
  attributes :length_inches, :year, :title, :make, :model, :price, :thumbnail,
             :price_symbol, :location, :latitude, :longitude, :is_geocoded
end
