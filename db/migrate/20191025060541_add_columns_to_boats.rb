class AddColumnsToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :length_imperial, :string
    add_column :boats, :length_meters, :float
    add_column :boats, :price_code, :string
    add_column :boats, :price_symbol, :string
    add_column :boats, :price_formatted, :string
    add_column :boats, :price_name, :string
    add_column :boats, :full_description, :text
  end
end
