class CreateJoinTableBoatsRegions < ActiveRecord::Migration[6.0]
  def change
    create_join_table :boats, :regions do |t|
      # t.index [:boat_id, :region_id]
      # t.index [:region_id, :boat_id]
    end
  end
end
