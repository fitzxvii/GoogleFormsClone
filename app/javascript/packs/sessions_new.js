$(document).ready(function(){
    $("input[type=email], input[type=password]").on("keypress", function(){
        $(".alert").remove();
    });
    
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
    });
});