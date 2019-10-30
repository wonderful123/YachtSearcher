class AddThumbnailColumnToListings < ActiveRecord::Migration[6.0]
  def change
    add_column :listings, :thumbnail, :string
  end
end
