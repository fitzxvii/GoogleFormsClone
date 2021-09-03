class CreateQuestions < ActiveRecord::Migration[6.1]
  def change
    create_table :questions do |t|
      t.references :form, null: false, foreign_key: true
      t.integer :question_type
      t.string :content
      t.integer :correct_option_id
      t.integer :score

      t.timestamps
    end
  end
end
