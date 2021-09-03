class FormsController < ApplicationController
    def dashboard
    end

    def create
    end

    def create_form
        new_form = Form.create_form

        if new_form[:status] 
            return redirect_to "/dashboard/create"
        end     
    end

    def view
    end

    def result
    end

    def answer
        render "view"
    end
end
