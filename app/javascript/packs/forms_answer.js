$(document).ready(function(){
    $("#form_to_answer").submit(function() {
        $.post($(this).attr("action"), $(this).serialize(), function(result) {
            console.log(result)
        }, 'json');
        return false;
    });
});