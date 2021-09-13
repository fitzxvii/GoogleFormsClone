class Answer < ApplicationRecord
    #belongs_to :user
    #belongs_to :form
    #belongs_to :question
    #belongs_to :option
    include :: QueryHelper

    # Insert all answers in the form submitted by current user 
    # Returns status if insert answers is successful or not
    # Owner: Fitz
    def self.insert_answers answers_params, current_user
        insert_values = ""

        answers_params.each do |key, value|
            if key.match(/form_answer_[0-9]/)
                insert_values += "(#{current_user}, #{answers_params["form_id"]}, #{key.gsub(/[^0-9]/, '')}, #{value}, NULL, NOW(), NOW()), "
            end
        end

        return { :answer => insert_values }
    end

end
