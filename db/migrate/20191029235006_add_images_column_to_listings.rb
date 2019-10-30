class AddImagesColumnToListings < ActiveRecord::Migration[6.0]
  def change
    add_column :listings, :images, :text, default: [].to_yaml
  end
end
