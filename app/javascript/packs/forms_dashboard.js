$(document).ready(function(){
    $(document).on("click", ".card-title", function(){
        let form_title = ($(this).text());
        $(this).after(`<input type="text" id="title" class="form-control" name="form[title]" value="${form_title}">`);
        $(this).hide();
    });

    $(document).on("keypress", "#title", function(){
        $(this).removeClass("is-invalid");
        $(this).next(".form_error").remove();
    });

    $(".rename_form").change(function(e){
        e.preventDefault();

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
});