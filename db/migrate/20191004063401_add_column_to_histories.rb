class AddColumnToHistories < ActiveRecord::Migration[6.0]
  def change
    add_column :histories, :change_type, :string
  end
end
