class ListingSerializer
  include FastJsonapi::ObjectSerializer
  attributes :images, :url
end
