$(document).ready(function(){
    $(document).on("click", ".card-title", function(){
        $(this).after('<input type="text" class="form-control" name="form[title]" value="Form Title">');
        $(this).hide();
    });
});