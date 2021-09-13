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

    # Get all results by form code and current
    # It will group by questions stored in hash
    # Requires: form code and current user
    # Owner: Fitz
    def self.get_results form_code, user_id
        results = {}
        question_order = JSON.parse(Form.get_question_order_by_code form_code)

        get_results = query_records([
            'SELECT answers.user_id, answers.question_id, questions.question_type, questions.content as "question", answers.option_id, options.content as "option", options.is_others, answers.text_answer
            FROM answers
            LEFT JOIN forms ON forms.id = answers.form_id
            LEFT JOIN questions ON questions.id = answers.question_id
            LEFT JOIN options ON options.id = answers.option_id
            WHERE forms.user_id = ? AND forms.code = ?;', user_id, form_code
        ])

        if question_order.present? && get_results.present?
            question_order.each do |question_id|
                get_results.each do |answer|   
                    if answer["question_id"] == question_id
                        results[question_id.to_s] = { "content" => answer["question"], "type" => answer["question_type"] }
                        results[question_id.to_s]["data"] = {} if results[question_id.to_s]["data"].nil?

                        if answer["text_answer"].present? && answer["option_id"].present? && answer["is_others"] == 1
                            results[question_id.to_s]["data"][answer["option"]] = "" if results[question_id.to_s]["data"][answer["option"]].nil?
                            
                            results[question_id.to_s]["data"][answer["option"]] += "#{answer["text_answer"]},"

                        elsif answer["text_answer"].present? && !answer["option_id"].present?
                            results[question_id.to_s]["data"]["answers"] = "" if results[question_id.to_s]["data"]["answers"].nil?

                            results[question_id.to_s]["data"]["answers"] += "#{answer["text_answer"]},"

                        else
                            results[question_id.to_s]["data"][answer["option"]] = 0 if results[question_id.to_s]["data"][answer["option"]].nil?
                            
                            results[question_id.to_s]["data"][answer["option"]] += 1
                        end
                    end
                end
            end 
        end

        return results
    end
end
