class Listing < ApplicationRecord
  belongs_to :boat
  belongs_to :site
  has_many :histories, dependent: :destroy

  serialize :images, Array
end
