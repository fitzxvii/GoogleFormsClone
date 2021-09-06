class Option < ApplicationRecord
    #belongs_to :question
    include :: QueryHelper
    
    # To add new default option
    # Owner: Fitz
    def self.create_default_option question_id
        response = { :status => false }

        new_option = insert_record([
            'INSERT INTO options (question_id, content, created_at, updated_at)
            VALUES(?, "New Option", NOW(), NOW());', question_id
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
            'SELECT * FROM options WHERE question_id IN (?);', question_ids
        ])
    end
end
