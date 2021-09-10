class Option < ApplicationRecord
    #belongs_to :question
    include :: QueryHelper
    
    # To add new default option
    # Owner: Fitz
    def self.create_default_option question_id
        response = { :status => false }

        new_option = insert_record([
            'INSERT INTO options (question_id, is_others, content, created_at, updated_at)
            VALUES(?, 0, NULL, NOW(), NOW());', question_id
        ])

        if new_option.present?
            response[:status] = true
            response[:option_id] = new_option
        end

        return response
    end

    # To get all options in choices
    # Owner: Fitz
    def self.collect_options_per_quetions question_ids
        return query_records([
            'SELECT * FROM options WHERE question_id IN (?) ORDER BY is_others ASC;', question_ids
        ])
    end

    # Delete options by question id after changing question type
    # Owner: Fitz
    def self.delete_options_by_question_id question_id
        response = { :status => false }

        deleted_record_count = delete_record([
            'DELETE FROM options
            WHERE question_id = ?', question_id
        ])

        response[:status] = true if deleted_record_count.present?

        return response
    end

    # Returns a response if update option content is successful or not
    # Requires: hash containing option id and new option content
    # Last Updated: September 8, 2021
    # Owner: Fitz, Updated By: Jovic Abengona
    def self.update_option_content option_params
        response = { :status => false }

        if option_params[:content].present?
            updated_option_content = update_record([
                'UPDATE options
                SET content = ?, updated_at = NOW()
                WHERE id = ?;', option_params[:content], option_params[:id]
            ])

            response[:status] = true if updated_option_content == 1
        end

        return response
    end

    # Returns a response if delete option is successful or not
    # Requires: hash containing option id
    # Owner: Fitz
    def self.delete_option option_param
        response = { :status => false,  :id => option_param[:id] }

        deleted_option = delete_record([
            'DELETE FROM options
            WHERE id = ?;', option_param[:id]
        ])

        response[:status] = true if deleted_option == 1

        return response
    end

    # To add others option on a question
    # Require: Question ID
    # It returns a response if insert others option is successful or not
    # Owner: Fitz
    def self.add_others_option question_id
        response = { :status => false }

        new_others_option = insert_record([
            'INSERT INTO options (question_id, is_others, content, created_at, updated_at)
            VALUES(?, 1, NULL, NOW(), NOW());', question_id
        ])
        
        if new_others_option.present?
            response[:status] = true 
            response[:option_id] = new_others_option
        end
        
        return response
    end

end
