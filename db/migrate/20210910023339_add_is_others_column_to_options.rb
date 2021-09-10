class AddIsOthersColumnToOptions < ActiveRecord::Migration[6.1]
  def change
    add_column :options, :is_others, :integer, after: :question_id
  end
end
