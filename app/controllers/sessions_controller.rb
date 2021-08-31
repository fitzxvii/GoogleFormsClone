class SessionsController < ApplicationController
    def new
        if current_user
            @msg = "YOWN"
        end
    end

    def create
    end

    def destroy
    end
end
