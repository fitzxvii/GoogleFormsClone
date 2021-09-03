class UsersController < ApplicationController
    skip_before_action :require_login, except: [:show, :edit, :update, :delete]
    
    def signup
    end

    def register
        signup_params = params.require(:signup).permit(:first_name, :last_name, :email, :password, :password_confirmation)

        validate_signup = User.validate_signup(signup_params)

        if validate_signup[:status]
            session[:user_id] = validate_signup[:user_data]
        end

        render json: validate_signup
    end
end
