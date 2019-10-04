class AddColumnToListings < ActiveRecord::Migration[6.0]
  def change
    add_column :listings, :uniq_id, :string
  end
end
