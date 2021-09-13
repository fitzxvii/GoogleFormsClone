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
        response = { :status => false }
        insert_values = ""

        answers_params.each do |key, value|
            if key.match(/form_answer_[0-9]/)
                value.each_with_index  do |answer, index|
                    # If value contains letters and the only element in the array
                    if value[index].match(/[A-Za-z]/) && value.length() == 1
                        insert_values += "(#{current_user}, #{answers_params["form_id"]}, #{key.gsub(/[^0-9]/, '')}, NULL, '#{value[index]}', NOW(), NOW()), "
                    
                    # If value contains letters and containing the Option ID
                    elsif value[index].match(/[A-Za-z]/) && value.length() > 1
                        insert_values += "(#{current_user}, #{answers_params["form_id"]}, #{key.gsub(/[^0-9]/, '')}, #{value[index - 1]}, '#{value[index]}', NOW(), NOW()), "
                    
                        # If value is Option ID and next value is a String
                    elsif value[index].match(/[0-9]/) && (!value[index+1].nil? && !value[index+1].match(/[A-Za-z]/))
                        insert_values += "(#{current_user}, #{answers_params["form_id"]}, #{key.gsub(/[^0-9]/, '')}, #{answer}, NULL, NOW(), NOW()), "
                    
                    # If value is Option ID and next value is Null
                    elsif value[index].match(/[0-9]/) && value[index+1].nil?
                        insert_values += "(#{current_user}, #{answers_params["form_id"]}, #{key.gsub(/[^0-9]/, '')}, #{answer}, NULL, NOW(), NOW()), "
                    end
                end  
            end
        end

        insert_values.sub!(/\, $/, ';')

        insert_answers = insert_record([
            "INSERT answers (user_id, form_id, question_id, option_id, text_answer, created_at, updated_at)
            VALUES #{ActiveRecord::Base::sanitize_sql(insert_values)}"
        ])

        response[:status] = true if insert_answers.present?

        return response
    end

end
