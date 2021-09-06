$(document).ready(function(){
    /**
    *   DOCU: This will hide the current element and add an input text for the user to type
    *   Triggered: .on("click", ".card-title", function()
    *   Last Updated Date: September 3, 2021
    *   @author Jovic Abengona
    */
    $(document).on("click", ".card-title", function(){
        let form_title = ($(this).text());
        $(this).after(`<input type="text" id="title" class="form-control" name="form[title]" value="${form_title}">`);
        $(this).hide();
    });

    /**
    *   DOCU: This will remove is-invalid class and .form_error elements
    *   Triggered: .on("keypress", "#title", function()
    *   Last Updated Date: September 3, 2021
    *   @author Jovic Abengona
    */
    $(document).on("keypress", "#title", function(){
        $(this).removeClass("is-invalid");
        $(this).next(".form_error").remove();
    });

    /**
    *   DOCU: This will send a post request to update form title. 
    *   If return is true, input text will be removed, previosly hidden element will be updated and displayed, and Opened last date will be updated as well
    *   Else, an error message will be displayed
    *   Triggered: .on("blur", ".rename_form", function()
    *   Last Updated Date: September 3, 2021
    *   @author Jovic Abengona
    */
    $(document).on("blur", ".rename_form", function(){
        $.post($(this).attr("action"), $(this).serialize(), function(result){
            $(".form_error").remove();

            if(result.status){
                $(`#form_title_${result.form_data["id"]}`).text(`${result.form_data["title"]}`);
                $(`#form_title_${result.form_data["id"]}`).show();
                $(`#form_details_${result.form_data["id"]}`).text(`Opened last ${result.form_data["updated_at"]}`);
                $("#title").remove();
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
        }, 'json');
        
        return false;
    });
    
    $(".rename_form").submit(function(e){
        e.preventDefault(); 
    });
});