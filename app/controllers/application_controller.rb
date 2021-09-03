class ApplicationController < ActionController::Base
    def current_user
        User.get_user(session[:user_id]) if session[:user_id]
    end

    helper_method :current_user
end
