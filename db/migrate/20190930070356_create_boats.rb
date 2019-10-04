class CreateBoats < ActiveRecord::Migration[6.0]
  def change
    create_table :boats do |t|
      t.float :length
      t.decimal :year
      t.string :title
      t.text :description
      t.string :make
      t.string :model
      t.decimal :cabins
      t.decimal :heads
      t.string :location
      t.string :country
      t.string :city
      t.string :state
      t.string :state_code
      t.string :hull_material
      t.float :price
      t.string :sale_status
      t.string :boat_name
      t.date :first_found
      t.string :type

      t.timestamps
    end
  end
end
