class Question < ApplicationRecord
    #belongs_to :form
    include :: QueryHelper
    
    # To add a new default question
    # Owner: Fitz
    def self.create_default_question form_id
        response = { :status => false }

        new_question = insert_record([
            'INSERT INTO questions (form_id, question_type, content, created_at, updated_at)
            VALUES(?, 1, "Question", NOW(), NOW());', form_id
        ])

        if new_question.present?
            response[:status] = true
            response[:question_id] = new_question
        end

        return response
    end

    # To get all questions inside question ids 
    def self.get_questions_by_ids form_id, question_ids
        return query_records([
            'SELECT * FROM questions 
            WHERE form_id = ? AND id IN (?);', form_id, question_ids
        ])
    end
end
