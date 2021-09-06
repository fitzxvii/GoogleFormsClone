class Question < ApplicationRecord
    #belongs_to :form
    include :: QueryHelper
    
    # To add a new default question
    # Owner: Fitz
    def self.create_default_question form_id
        response = { :status => false }

        new_question = self.insert_default_question form_id

        if new_question.present?
            response[:status] = true
            response[:question_id] = new_question
        end

        return response
    end

    # To get all questions inside question ids 
    # Owner: Fitz
    # Last Update date: September 6, 2021
    def self.get_questions_by_ids form_id, question_ids
        return query_records([
            'SELECT * FROM questions 
            WHERE form_id = ?
            ORDER BY field(id, ?);', 
            form_id, question_ids
        ])
    end

    # It returns a response if addition is successful or not
    # Owner: Fitz
    def self.add_new_question form_id
        response = { :status => false }
        new_question = self.insert_default_question form_id

        if new_question.present?
            response[:question_id] = new_question

            new_option = Option.create_default_option new_question

            if new_option[:status] && new_option[:option_id].present?
                response[:option_id] = new_option[:option_id]

                form_order_update = Form.update_form_question_order form_id, new_question

                response[:status] = true if form_order_update[:status] == true
            end
        end

        return response
    end

    private
        # To insert new question in the database
        # Owner: Fitz 
        def self.insert_default_question form_id
            insert_record([
                'INSERT INTO questions (form_id, question_type, content, created_at, updated_at)
                VALUES(?, 1, "Question", NOW(), NOW());', form_id
            ])
        end
end
