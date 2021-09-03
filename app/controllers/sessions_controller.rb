class SessionsController < ApplicationController
    skip_before_action :require_login, except: [:destroy]

    def new
        if current_user
            redirect_to "/dashboard"
        end
    end

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
