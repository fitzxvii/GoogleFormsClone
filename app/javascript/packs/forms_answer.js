$(document).ready(function(){

     /**
    *   DOCU: This will send an POST request to submit the answers of the form
    *   It will show the modal if the submission is successful or not
    *   Triggered:  $("#form_to_answer").submit()
    *   @author Fitz
    */
    $("#form_to_answer").submit(function() {
        $.post($(this).attr("action"), $(this).serialize(), function(result) {
            if(result["status"]) {
                modal_header_remove_class = "alert-warning";
                modal_header_add_class = "text-success alert-success";
                modal_title = "<i class='fas fa-check text-success'></i> Success!";
                modal_body = `
                    <p class="fw-bold"> Your answers are now recorded.  </p>
                    <p> Thank you for answering!</p>
                `;
                modal_footer = "<button type='button' class='btn btn-success' data-bs-dismiss='modal'>Okay</button>";
            }
            else{
                modal_header_remove_class = "text-success alert-success";
                modal_header_add_class = "alert-danger";
                modal_title = "<i class='fas fa-exclamation-circle text-danger'></i> Error!";
                modal_body = `
                    <p class="fw-bold"> Oopps... Something went wrong! </p>
                `;
                modal_footer = "<button type='button' class='btn btn-danger' data-bs-dismiss='modal'>Okay</button>";
            }

            $("#quiz_toggle_modal .modal-header").removeClass(modal_header_remove_class);
            $("#quiz_toggle_modal .modal-header").addClass(modal_header_add_class);
            $("#message_modal .modal-title").html(modal_title);
            $("#message_modal .modal-body").html(modal_body);
            $("#message_modal .modal-footer").html(modal_footer);

            $("#message_modal").modal("show");
        }, 'json');

        return false;
    });
});