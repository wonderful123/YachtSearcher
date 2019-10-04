class CreateJoinTableBoatslistings < ActiveRecord::Migration[6.0]
  def change
    create_join_table :boats, :listings do |t|
      # t.index [:boat_id, :listing_id]
      # t.index [:listing_id, :boat_id]
    end
  end
end
