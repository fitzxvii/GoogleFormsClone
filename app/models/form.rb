class Form < ApplicationRecord
    #belongs_to :user
    include :: QueryHelper

    # Insert a new default form 
    # Require: user_id
    # Returns: status and new form id
    # Owner: Fitz 
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
                        SET question_order = ?
                        WHERE id = ?;', "[#{new_question[:question_id]}]", new_form
                    ])

                    if form_order_update == 1
                        response[:status] = true
                    end
                end
            end
        end

        return response
    end

    # It returns the form data by code
    # Owner: Fitz
    def self.get_form_by_code user_id, code
        return query_record([
            'SELECT id, user_id, form_type, title, description, status, question_order
            FROM forms
            WHERE user_id = ? AND code = ?;', user_id, code
        ])
    end
    
    private
        # Generate code of form with length of 10
        # Owner: Fitz
        def self.generate_form_code
            charsets = [ ('a'...'z').to_a, ('A'...'Z').to_a, ('0'...'9').to_a ].flatten
            return (1...10).inject(""){ |s, x| s << charsets[rand(charsets.length)]}
        end
end
