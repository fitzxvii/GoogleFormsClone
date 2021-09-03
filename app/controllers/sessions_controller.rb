class SessionsController < ApplicationController
    def new
        if current_user
            redirect_to "/dashboard"
        end
    end

    def create
    end

    def destroy
    end
end
