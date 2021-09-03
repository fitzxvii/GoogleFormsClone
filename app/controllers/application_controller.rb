class ApplicationController < ActionController::Base
    before_action :require_login

    # DOCU: (GET)
	# Check if user is logged in
	# Triggered by: visting a route that requires being logged in
    # Requires: session[:user_id]
    # Returns: User data (id, first_name, last_name, email)
    # Last Updated: September 3, 2021
    # Owner: Jovic Abengona
    def current_user
        User.get_user(session[:user_id]) if session[:user_id]
    end

    helper_method :current_user

    private
        # DOCU: (GET)
        # Redirect user to login page if user is not logged in
        # Triggered by: visting a route that requires being logged in
        # Last Updated: September 3, 2021
        # Owner: Jovic Abengona
        def require_login
            if !current_user
                redirect_to "/"
            end
        end
end
