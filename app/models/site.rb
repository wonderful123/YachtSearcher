class Site < ApplicationRecord
  has_many :listings, dependent: :destroy
end
