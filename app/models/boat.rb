class Boat < ApplicationRecord
  has_and_belongs_to_many :regions
  has_many :listings, dependent: :destroy
  has_many_attached :images
  has_one_attached :thumbnail
end
