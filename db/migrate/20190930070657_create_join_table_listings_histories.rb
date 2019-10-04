class CreateJoinTableListingsHistories < ActiveRecord::Migration[6.0]
  def change
    create_join_table :listings, :histories do |t|
      # t.index [:listing_id, :history_id]
      # t.index [:history_id, :listing_id]
    end
  end
end
