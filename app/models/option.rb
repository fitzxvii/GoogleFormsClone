class Option < ApplicationRecord
    #belongs_to :question
    include :: QueryHelper
    
    #To add new option
    def self.create_default_option question_id
        response = { :status => false }

        new_option = insert_record([
            'INSERT INTO options (question_id, content, created_at, updated_at)
            VALUES(?, "Option 1", NOW(), NOW());', question_id
        ])

        if new_option.present?
            response[:status] = true
            response[:option_id] = new_option
        end

        return response
    end
end
