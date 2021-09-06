class FormsController < ApplicationController
    # DOCU: (GET) /dashboard
	# Get forms based on current_user["id"]
	# Triggered by: visting /dashboard
    # Requires: current_user["id"]
    # Returns: Hash data containing details about each form
    # Last Updated: September 3, 2021
    # Owner: Jovic Abengona
    def dashboard
        @forms = Form.get_forms(current_user["id"])
    end

    # DOCU: (GET) /f/:code
    # Get form data based on current user and form code
    # Triggered by: create_form method or updating a form
    # Requires: current user logged in and the form code
    # Returns: Form data, question data by form id and question order, and options per question
    # Owner: Fitz
    # Last Update date: September 3, 2021
    def create
        @form_data = Form.get_form_by_code current_user["id"], params[:code]
        @questions = Question.get_questions_by_ids @form_data['id'], JSON.parse(@form_data['question_order'])
        @all_options = Option.collect_options_per_quetions JSON.parse(@form_data['question_order'])
    end

    # DOCU: (GET) /create_form
    # Create a new form with question and a option in default format
    # Triggered by: Clicking create new form 
    # Requires: current user logged in 
    # Returns: Redirect to create URL
    # Owner: Fitz
    # Last Update date: September 3, 2021
    def create_form
        new_form = Form.create_form(current_user["id"])

        if new_form[:status] 
            return redirect_to "/f/#{new_form[:form_code]}"
        end     
    end

    # DOCU: (GET) /add_question/:form_id
    # Add a new question in form, update question order of the form, and render it to user
    # Triggered by: Clicking add question
    # Owner: Fitz 
    def add_question
        render json: Question.add_new_question(params[:form_id])
    end

    # DOCU: (GET) /add_option/:question_id
    # Add a new option in default format
    # Triggered by: Clicking add option
    # Owner: Fitz
    def add_option
        render json: Option.create_default_option(params[:question_id])
    end

    def rename_form
        form_data = params.require(:form).permit(:title)

        validate_rename = Form.validate_rename(params["id"], form_data)

        render json: validate_rename
    end

    def view
    end

    def result
    end

    def answer
        render "view"
    end
end
