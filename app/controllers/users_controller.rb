class UsersController < ApplicationController
    skip_before_action :require_login, except: [:show, :edit, :update, :delete]
    
    def signup
    end

    # DOCU: (POST) /register
	# Validate user data. If valid, save user record
	# Triggered by: sending a POST request to /register
    # Requires: signup[:first_name], signup[:last_name], signup[:email], signup[:password], signup[:password_confirmation]
    # Returns: Hash data containing :status. :errors, and :user_data
    # Last Updated: September 3, 2021
    # Owner: Jovic Abengona
    def register
        signup_params = params.require(:signup).permit(:first_name, :last_name, :email, :password, :password_confirmation)

        validate_signup = User.validate_signup(signup_params)

        if validate_signup[:status]
            session[:user_id] = validate_signup[:user_data]
        end

        render json: validate_signup
    end
end
