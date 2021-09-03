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

    def create
    end

    def create_form
        new_form = Form.create_form(current_user["id"])

        if new_form[:status] 
            return redirect_to "/dashboard/create"
        end     
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
