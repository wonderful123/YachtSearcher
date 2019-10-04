class CreateHistories < ActiveRecord::Migration[6.0]
  def change
    create_table :histories do |t|
      t.float :price
      t.string :sale_status
      t.date :change_date
      t.references :listing, null: false, foreign_key: true

      t.timestamps
    end
  end
end
