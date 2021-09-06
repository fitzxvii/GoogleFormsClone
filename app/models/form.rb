class Form < ApplicationRecord
    #belongs_to :user
    include :: QueryHelper

    validates :title, :description, presence: true

    def self.get_forms(current_user)
        query_records(["SELECT * FROM forms WHERE user_id = ? ORDER BY updated_at DESC", current_user])
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
    # Owner: Fitz
    def self.get_form_by_code user_id, code
        query_record([
            'SELECT id, user_id, form_type, title, description, status, question_order
            FROM forms
            WHERE user_id = ? AND code = ?;', user_id, code
        ])
    end
    
    def self.validate_rename(id, form_data)
        get_form = self.get_form(id)

        new_form_data = Form.new(
            :title       => form_data[:title],
            :description => get_form["description"]
        )

        status = new_form_data.valid?

        if status
            update_form = update_record(["UPDATE forms SET title = ?, updated_at = NOW() WHERE id = ?", form_data[:title], id])

            status = true if update_form
            return_form_data = self.get_form(id)
            return_form_data["updated_at"] = return_form_data["updated_at"].strftime("%B %d, %Y | %I:%M %p")
        else
            errors = new_form_data.errors.messages
        end

        return { :status => status, :errors => errors, :form_data => return_form_data }
    end

    # It returns the response if the update of question order is successful or not
    # Owner: Fitz
    def self.update_form_question_order form_id, question_id
        response = { :status => false }

        form_question_order = query_record([
            'SELECT question_order 
            FROM forms 
            WHERE id = ?', form_id
        ])

        if form_question_order.present?
            parsed_question_order = JSON.parse(form_question_order["question_order"])
            parsed_question_order.push(question_id)

            update_question_order = update_record([
                'UPDATE forms
                SET question_order = ?, updated_at = NOW()
                WHERE id = ?;', "#{parsed_question_order}", form_id
            ])

            response[:status] = true if update_question_order == 1
        end

        return response
    end
  
    private
        # Generate code of form with length of 10
        # Owner: Fitz
        def self.generate_form_code
            charsets = [ ('a'...'z').to_a, ('A'...'Z').to_a, ('0'...'9').to_a ].flatten
            return (1...10).inject(""){ |s, x| s << charsets[rand(charsets.length)]}
        end
end
