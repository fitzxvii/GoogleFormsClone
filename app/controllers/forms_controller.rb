class FormsController < ApplicationController
    def dashboard
    end

    def create
        @form_data = Form.get_form_by_code current_user["id"], params[:code]
        @questions = Question.get_questions_by_ids @form_data['id'], JSON.parse(@form_data['question_order'])
        @all_options = Option.collect_options_per_quetions JSON.parse(@form_data['question_order'])
    end

    def create_form
        new_form = Form.create_form(current_user["id"])

        if new_form[:status] 
            return redirect_to "/f/#{new_form[:form_code]}"
        end     
    end

    def view
    end

    def result
    end

    def answer
        render "view"
    end
end
