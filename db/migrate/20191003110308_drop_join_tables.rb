class DropJoinTables < ActiveRecord::Migration[6.0]
  def change
    drop_join_table :boats, :listings
    drop_join_table :histories, :listings
    drop_join_table :listings, :sites
  end
end
