class ImagesSerializer
  include FastJsonapi::ObjectSerializer
  set_type :images
  set_key_transform :dash
  attributes :images
end
