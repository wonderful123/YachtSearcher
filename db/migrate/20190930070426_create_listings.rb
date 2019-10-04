class CreateListings < ActiveRecord::Migration[6.0]
  def change
    create_table :listings do |t|
      t.float :price
      t.string :sale_status
      t.text :description
      t.string :title
      t.date :first_found
      t.string :url
      t.references :boat, null: false, foreign_key: true
      t.references :site, null: false, foreign_key: true

      t.timestamps
    end
  end
end
