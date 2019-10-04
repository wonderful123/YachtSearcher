class AddColumnToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :latitude, :float
    add_column :boats, :longitude, :float
    add_column :boats, :continent, :string
  end
end
