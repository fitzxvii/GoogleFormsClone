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

    # Require: hash data with form id
    # It returns a response if addition is successful or not
    # Owner: Fitz
    def self.add_new_question form
        response = { :status => false }
        new_question = self.insert_default_question form['id']

        if new_question.present?
            response[:question_id] = new_question

            new_option = Option.create_default_option new_question

            if new_option[:status] && new_option[:option_id].present?
                response[:option_id] = new_option[:option_id]

                form_order_update = Form.update_form_question_order(form['id'], new_question, true)

                response[:status] = true if form_order_update[:status]
            end
        end

        return response
    end

    # It returns status if update of question content is successful or not
    # Last Updated: September 8, 2021
    # Owner: Fitz, Updated By: Jovic Abengona
    def self.update_question_content question_params
        response = { :status => false }
        
        if question_params[:content].present?
            updated_question_content = update_record([
                'UPDATE questions
                SET content = ?, updated_at = NOW()
                WHERE id = ?;', question_params[:content], question_params[:id]
            ])

            response[:status] = true if updated_question_content == 1
        end

        return response
    end

    # It returns status if update is successful or not
    # Last Updated: September 9, 2021
    # Owner: Fitz, Updated By: Jovic Abengona
    def self.update_question_type form_params
        response = { :status => false, :question_id => form_params[:question_id] }
        update_question_type = update_record([
            'UPDATE questions 
            SET question_type = ?, updated_at = NOW()
            WHERE id = ?;', form_params[:question_type], form_params[:question_id]
        ])

        if update_question_type == 1
            get_question_data = query_record(["SELECT content, score FROM questions WHERE id = ?", form_params[:question_id]])

            delete_options = Option.delete_options_by_question_id form_params[:question_id]

            response[:content] = get_question_data["content"] if get_question_data
            response[:score] = get_question_data["score"] if get_question_data
            response[:status] = true if delete_options[:status]
        end

        return response
    end

    # It returns status if delete question is successful or not
    # Owner: Fitz
    def self.delete_question question_params
        response = { :status => false }

        if(question_params['question_type_id'] = 1 || question_params['question_type_id'] = 2)
            delete_options = Option.delete_options_by_question_id  question_params['id']

            delete_question_query = delete_record(['DELETE FROM questions WHERE id =?;', question_params['id']]) if delete_options[:status]
        else
            delete_question_query = delete_record([
                'DELETE FROM questions
                WHERE id = ?;', question_params['id']
            ])
        end

        if delete_question_query == 1
            form_order_update = Form.update_form_question_order(question_params['form_id'], question_params['id'], false)

            response[:status] = true if form_order_update[:status]
        end

        return response
    end

    # It returns status if update question is successful or not
    # Owner: Fitz
    def self.update_score question_params
        response = { :status => false }

        if question_params[:score].match(/^(\d)+$/)
            updated_score = update_record([
                'UPDATE questions 
                SET score = ?
                WHERE id = ?;', question_params[:score], question_params[:id]
            ])
        
            response[:status] = true if updated_score == 1
        end

        return response
    end 

    # It returns status if update correct option is successful or not
    # Owner: Fitz
    def self.update_correct_option question_params
        response = { :status => false }
        option_id = question_params[:option_id].to_i

        question_data = query_record([
            "SELECT correct_option_ids 
            FROM questions
            WHERE id = ?;", question_params[:question_id]
        ])

        if question_data.present?
            if !question_data["correct_option_ids"].nil?       
                parsed_correct_options = JSON.parse(question_data["correct_option_ids"]);

                if(question_params[:question_type_id].to_i == 1)
                    (parsed_correct_options[0] != option_id) ? parsed_correct_options[0] = option_id : 
                                                                parsed_correct_options.pop()
                else
                    (parsed_correct_options.include?(option_id)) ? parsed_correct_options.delete(option_id) :
                                                                   parsed_correct_options.push(option_id)
                end
                 
            else
                parsed_correct_options = [option_id]
            end
        end
        updated_question = update_record([
            'UPDATE questions 
            SET correct_option_ids = ?
            WHERE id = ?;', "#{parsed_correct_options}", question_params[:question_id]
        ])   

        response[:status] = true if updated_question.present?

        return response
    end

    private
        # To insert new question in the database
        # Last Updated: September 10, 2021
        # Owner: Fitz, Updated By: Jovic Abengona
        def self.insert_default_question form_id
            insert_record([
                'INSERT INTO questions (form_id, question_type, content, correct_option_ids, score, created_at, updated_at)
                VALUES(?, ?, NULL, "[]", ?, NOW(), NOW());', form_id, QUESTION_MULTIPLE_CHOICE, DEFAULT_SCORE
            ])
        end
end
