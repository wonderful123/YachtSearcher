class CreateJoinTableSitesListings < ActiveRecord::Migration[6.0]
  def change
    create_join_table :sites, :listings do |t|
      # t.index [:site_id, :listing_id]
      # t.index [:listing_id, :site_id]
    end
  end
end
