class AddColumnToListing < ActiveRecord::Migration[6.0]
  def change
    add_column :listings, :full_description, :text
    add_column :listings, :price_code, :string
    add_column :listings, :price_symbol, :string
    add_column :listings, :price_formatted, :string
    add_column :listings, :price_name, :string
  end
end
