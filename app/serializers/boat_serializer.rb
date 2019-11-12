class BoatSerializer
  include FastJsonapi::ObjectSerializer
  set_key_transform :dash
  attributes :length_inches, :year, :title, :description, :make, :model, :price, :price_symbol, :price_formatted, :thumbnail
end
