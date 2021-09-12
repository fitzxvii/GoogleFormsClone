class Form < ApplicationRecord
    #belongs_to :user
    include ::QueryHelper
    require 'json'

    validates :title, :description, presence: true

    def self.get_forms(current_user)
        query_records(["SELECT * FROM forms WHERE user_id = ? ORDER BY status DESC, updated_at DESC", current_user])
    end

    def self.get_form(id)
        query_record(["SELECT * FROM forms WHERE id = ?", id])
    end

    # Insert a new default form 
    # Require: user_id
    # Returns: status and new form id
    # Last Updated: September 6, 2021
    # Owner: Fitz, Updated by: Jovic Abengona
    def self.create_form(current_user)
        response = { :status => false }
        code = self.generate_form_code

        new_form = insert_record([
            "INSERT INTO forms (user_id, code, form_type, title, description, status, created_at, updated_at)
            VALUES(?, ?, 0, 'Untitled Form', 'Form Description', 0, NOW(), NOW());", current_user, code
        ])

        if new_form.present?
            response[:form_id] = new_form
            response[:form_code] = code

            new_question = Question.create_default_question new_form

            if new_question[:status] && new_question[:question_id].present?
                new_option = Option.create_default_option new_question[:question_id]

                if new_option[:status] && new_option[:option_id].present?
                    form_order_update = update_record([
                        'UPDATE forms
                        SET question_order = ?, updated_at = NOW()
                        WHERE id = ?;', "[#{new_question[:question_id]}]", new_form
                    ])

                    response[:status] = true if form_order_update == 1
                end
            end
        end

        return response
    end

    # It returns the form data by code
    # Requires: user id, form code
    # Owner: Fitz
    def self.get_form_by_code user_id, code
        return query_record([
            'SELECT id, user_id, code, form_type, title, description, status, question_order
            FROM forms
            WHERE user_id = ? AND code = ?;', user_id, code
        ])
    end
    
    # Check if title is present
    # then Update form title 
    # Require: id, form_data[:title]
    # Returns: a Hash data containing :status, :errors, and :form_data
    # Last Updated: September 3, 2021
    # Owner:  Jovic Abengona
    def self.validate_rename(user_id, form_data)
        get_form = self.get_form(form_data[:id])

        new_form_data = Form.new(
            :title       => form_data[:title],
            :description => get_form["description"]
        )

        status = new_form_data.valid?

        if status
            update_form = update_record(["UPDATE forms SET title = ?, updated_at = NOW() WHERE id = ? AND user_id = ?", form_data[:title], form_data[:id], user_id])

            status = true if update_form
            return_form_data = self.get_form(form_data[:id])
            return_form_data["updated_at"] = return_form_data["updated_at"].strftime("%B %d, %Y | %I:%M %p")
        else
            errors = new_form_data.errors.messages
        end

        return { :status => status, :errors => errors, :form_data => return_form_data }
    end

    # Convert each element of array to int
    # then Update question order
    # Require: user_id, id, question_ids
    # Returns: Boolean data depending on the result of update_record query helper
    # Last Updated: September 10, 2021
    # Owner: Jovic Abengona
    def self.update_question_order(user_id, id, question_ids)
        question_order = question_ids.map(&:to_i)

        update_question_order = update_record(["UPDATE forms SET question_order = ?, updated_at = NOW() WHERE id = ? AND user_id = ?", "#{question_order}", id, user_id])

        if update_question_order
            status = true
        else
            status = false
        end

        return status
    end

    # Check if title and description is present
    # then Update form title and/or description
    # Require: user_id, and form_data containing :id, :title, and :description
    # Returns: a Hash data containing :status, and :errors
    # Last Updated: September 7, 2021
    # Owner:  Fitz, Updated By: Jovic Abengona
    def self.update_form_title_and_description(user_id, form_data)
        new_form_data = Form.new(
            :title       => form_data[:title],
            :description => form_data[:description]
        )

        status = new_form_data.valid?

        if status
            update_form = update_record(["UPDATE forms 
                                            SET title = ?, description = ?, updated_at = NOW() WHERE id = ? AND user_id = ?", 
                                            form_data[:title], form_data[:description], form_data[:id], user_id])

            status = true if update_form
        else
            errors = new_form_data.errors.messages
        end

        return { :status => status, :errors => errors }
    end

    # It returns the response if the update of question order is successful or not
    # Requires: form id and question id
    # Last Update date: Sept. 9, 2021
    # Owner: Fitz, Updated By: Jovic Abengona
    def self.update_form_question_order form_id, question_id, action
        response = { :status => false }

        form_question_order = query_record([
            'SELECT question_order 
            FROM forms 
            WHERE id = ?', form_id
        ])

        if form_question_order.present?
            parsed_question_order = JSON.parse(form_question_order["question_order"])

            action ? parsed_question_order.push(question_id.to_i) : parsed_question_order.delete(question_id.to_i)

            update_question_order = update_record([
                'UPDATE forms
                SET question_order = ?, updated_at = NOW()
                WHERE id = ?;', "#{parsed_question_order}", form_id
            ])

            response[:status] = true if update_question_order == 1
        end

        return response
    end

    # Update form type 
    # Require: form_id, quiz_mode_toggle, user_id
    # Returns: status and quiz mode toggle value
    # Last Updated: September 9, 2021
    # Owner: Jovic Abengona, Updated by: Fitz
    def self.quiz_mode_toggle(form_id, quiz_mode_toggle, user_id)
        if JSON.parse(quiz_mode_toggle)
            form_type = 1
        else
            form_type = 0
        end

        update_form_type = update_record(["UPDATE forms SET form_type = ?, updated_at = NOW() WHERE id = ? AND user_id = ?", form_type, form_id, user_id])

        if update_form_type
            if form_type = 0 
                reset_question_score = update_record([
                    "UPDATE questions SET score = 0, correct_option_ids = '[]', updated_at = NOW()
                    WHERE form_id = ? AND question_type IN (1, 2);", form_id])

                status = true if reset_question_score.present?
            else
                status = true
            end
        else
            status = false
        end

        return { :status => status, :is_quiz_mode => quiz_mode_toggle }
    end

    # Update form status
    # Require: id, user_id
    # Returns: status which contains a Boolean value
    # Last Updated: September 11, 2021
    # Owner: Jovic Abengona | Updated By: Fitz
    def self.publish_form(id, user_id)
        response = { :status => false }
        validate_form = false
        validate_question = false
        form_data = Form.get_form(id)

        validate_form = true if !form_data["title"].nil? && !form_data["description"].nil? && form_data["question_order"] != "[]"

        if validate_form
            questions_data = query_records(["SELECT q.question_type, q.content AS 'question_content', q.correct_option_ids, q.score, o.content AS 'option_content', o.is_others AS 'others_option'
                                                FROM questions AS q
                                                LEFT JOIN options AS o ON o.question_id = q.id
                                                WHERE q.form_id =?", id])

            questions_data.each do |question|
                if form_data["form_type"] === 0
                    if question["question_type"] === 1 || question["question_type"] === 2
                        if question["others_option"] == 1 && !question["question_content"].nil?
                            validate_question = true
                        elsif question["others_option"] == 0 && !question["question_content"].nil? && !question["option_content"].nil?
                            validate_question = true
                        else
                            validate_question = false
                            break
                        end
                    elsif question["question_type"] === 3 || question["question_type"] === 4
                        if !question["question_content"].nil?
                            validate_question = true
                        else
                            validate_question = false
                            break
                        end
                    end
                else
                    if question["question_type"] === 1 || question["question_type"] === 2
                        if question["others_option"] == 0 && !question["question_content"].nil? && !question["option_content"].nil? && question["correct_option_ids"] != "[]" && question["score"] != 0
                            validate_question = true
                        elsif question["others_option"] == 1 && !question["question_content"].nil? && question["correct_option_ids"] != "[]" && question["score"] != 0
                            validate_question = true
                        else
                            validate_question = false
                            break
                        end
                    elsif question["question_type"] === 3 || question["question_type"] === 4
                        if !question["question_content"].nil? && question["score"] != 0
                            validate_question = true
                        else
                            validate_question = false
                            break
                        end
                    end
                end
            end
        end

        if validate_form && validate_question
            publish_form = update_record(["UPDATE forms SET status = 1, updated_at = NOW() WHERE id = ? AND user_id = ?", id, user_id])
        end

        response[:status] = true if validate_form && validate_question && publish_form

        return response
    end

    def self.get_result(id, user_id)
        response = { :status => false, :code => nil }
        publish_form = update_record(["UPDATE forms SET status = 2, updated_at = NOW() WHERE id = ? AND user_id = ?", id, user_id])

        if publish_form
            get_form = self.get_form(id)

            response[:status] = true
            response[:code] = get_form["code"]
        else
            response[:status] = false
        end

        return response
    end
    
    # Delete form
    # Require: id, user_id
    # Returns: status which contains a Boolean value
    # Last Updated: September 6, 2021
    # Owner: Updated by: Jovic Abengona
    def self.delete_form(id, user_id)
        delete_form = delete_record(["DELETE FROM forms WHERE id = ? AND user_id = ?", id, user_id])
        
        if delete_form > 0
            status = true
        else
            status = false
        end

        return status
    end
  
    private
        # Generate code of form with length of 10
        # Owner: Fitz
        def self.generate_form_code
            charsets = [ ('a'...'z').to_a, ('A'...'Z').to_a, ('0'...'9').to_a ].flatten
            return (1...10).inject(""){ |s, x| s << charsets[rand(charsets.length)]}
        end
end
