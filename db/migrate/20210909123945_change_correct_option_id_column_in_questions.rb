class ChangeCorrectOptionIdColumnInQuestions < ActiveRecord::Migration[6.1]
  def change
    change_column :questions, :correct_option_id, :text
    rename_column :questions, :correct_option_id, :correct_option_ids
  end
end
