class SessionsController < ApplicationController
    skip_before_action :require_login, except: [:destroy]

    # DOCU: (GET) /
	# Render login page. Redirect user to /dashboard if user is already logged in
	# Triggered by: visting /
    # Requires: session[:user_id]
    # Returns: User data (id, first_name, last_name, email)
    # Last Updated: September 3, 2021
    # Owner: Jovic Abengona
    def new
        if current_user
            redirect_to "/dashboard"
        end
    end

    # DOCU: (POST) /login
	# Check if email and password matches record
	# Triggered by: sending a POST request to /login
    # Requires: login[:email], login[:password]
    # Returns: Hash data containing :status. and :user_data
    # Last Updated: September 3, 2021
    # Owner: Jovic Abengona
    def create
        login_params = params.require(:login).permit(:email, :password)

        check_login_info = User.login(login_params)

        if check_login_info[:status]
            session[:user_id] = check_login_info[:user_data]
        end

        render json: check_login_info
    end

    def destroy
        reset_session
        redirect_to "/"
    end
end
