$(document).ready(function(){
    /**
    *   DOCU: This will remove .alert element
    *   Triggered: $("input[type=email], input[type=password]").on("keypress", function()
    *   Last Updated Date: September 3, 2021
    *   @author Jovic Abengona
    */
    $("input[type=email], input[type=password]").on("keypress", function(){
        $(".alert").remove();
    });
    
    /**
    *   DOCU: This will send a post request to check email and password provided
    *   If result is true, user will be redirected to /dahsboard
    *   Else, an error message will be displayed
    *   Triggered: $("#signin_form").submit()
    *   Last Updated Date: September 3, 2021
    *   @author Jovic Abengona
    */
    $("#signin_form").submit(function(e){
        e.preventDefault();

        $.post($(this).attr("action"), $(this).serialize(), function(result){
            $(".alert").remove();

            if(result.status){
                window.location.href = "http://localhost:3000/dashboard";
            }
            else{
                $("#signin_form").after(`
                    <div class="alert alert-danger m-3" role="alert">
                        <i class="fas fa-times-circle"></i> Invalid Email or Password!
                    </div>
                `);
            }
        });

        return false;
    });
});