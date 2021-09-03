$(document).ready(function(){
    $("input[type=text], input[type=email], input[type=password]").on("keypress", function(){
        $(this).removeClass("is-invalid");
        $(this).next(".form_error").remove();
    });
    
    $("#signup_form").submit(function(e){
        e.preventDefault();

        $.post($(this).attr("action"), $(this).serialize(), function(result){
            $(".form_error").remove();

            if(result.status){
                window.location.href = "http://localhost:3000/dashboard";
            }
            else{
                for([key, value] of Object.entries(result.errors)){
                    let capitalized_key = key.split('_').join(' ');
                    capitalized_key = capitalized_key.charAt(0).toUpperCase() + capitalized_key.slice(1);

                    $(`#${key}`).addClass("is-invalid");
                    $(`#${key}`).after(`
                        <p class="form_error fst-italic text-danger">${capitalized_key} ${value[0]}</p>
                    `);
                }
            }
        });
    });
});