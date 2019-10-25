class RenameLengthToLengthInchesInBoats < ActiveRecord::Migration[6.0]
  def change
    rename_column :boats, :length, :length_inches
  end
end
