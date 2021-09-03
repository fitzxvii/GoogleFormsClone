class Question < ApplicationRecord
    #belongs_to :form
    include :: QueryHelper
    
    # To add a new default question
    def self.create_default_question form_id
        response = { :status => false }

        new_question = insert_record([
            'INSERT INTO questions (form_id, question_type, content, created_at, updated_at)
            VALUES(?, 0, "Question", NOW(), NOW());', form_id
        ])

        if new_question.present?
            response[:status] = true
            response[:question_id] = new_question
        end

        return response
    end
end
