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
    # Last Update date: September 6, 2021
    # Owner: Fitz, Updated By: Jovic Abengoa
    def create
        @form_action = "publish"
        @form_data = Form.get_form_by_code current_user["id"], params[:code]
        @questions = Question.get_questions_by_ids @form_data['id'], JSON.parse(@form_data['question_order'])
        @all_options = Option.collect_options_per_quetions JSON.parse(@form_data['question_order'])

        if @form_data["status"] === 1
            @form_action = "end"
        end
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

    # DOCU: (POST) /form/rename/:id
	# Validate form_data then rename form title
	# Triggered by: Sending POST request to /form/rename/:id
    # Requires: params[:id], current_user["id"], form_data
    # Returns: Hash data containing :status, :errors, and :form_data
    # Last Updated: September 3, 2021
    # Owner: Jovic Abengona
    def rename_form
        form_data = params.require(:form).permit(:title)

        validate_rename = Form.validate_rename(params[:id], current_user["id"], form_data)

        render json: validate_rename
    end

    # DOCU: (POST) /form/publish/:id/:code
	# Update form status then return a flash data
	# Triggered by: Sending POST request to /form/publish/:id/:code
    # Requires: params[:id], current_user["id"]
    # Returns: Flash data containing :alert_type, :message, and :icon
    # Last Updated: September 6, 2021
    # Owner: Jovic Abengona
    def publish_form
        status = Form.publish_form(params[:id], current_user["id"])

        if status
            flash[:publish_message] = { :alert_type => "success", :message => "Form has been published!", :icon => "check" }
        else
            flash[:publish_message] = { :alert_type => "danger", :message => "Unable to publish form!", :icon => "times" }
        end

        redirect_to "/f/#{params[:code]}"
    end

    # DOCU: (POST) /form/delete/:id
	# Delete form then return a flash data
	# Triggered by: Sending POST request to /form/delete/:id
    # Requires: params[:id], current_user["id"]
    # Returns: Flash data containing :alert_type, :message, and :icon
    # Last Updated: September 6, 2021
    # Owner: Jovic Abengona
    def delete
        status = Form.delete_form(params[:id], current_user["id"])

        if status
            flash[:delete_message] = { :alert_type => "success", :message => "Form has been deleted!", :icon => "check" }
        else
            flash[:delete_message] = { :alert_type => "danger", :message => "Unable to delete form!", :icon => "times" }
        end

        redirect_to "/"
    end

    def view
    end

    def result
    end

    def answer
        render "view"
    end
end
