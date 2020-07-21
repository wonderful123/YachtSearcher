class AddIsGeocodedToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :is_geocoded, :boolean
  end
end
