$(document).ready(function(){
    const auth_token = $("#auth_token").val();
    let is_quiz_mode
    let question_counter = 1;
    let choice_counter = 1;

    $("#sortable").sortable();
    $("#sortable").disableSelection();

    $("#create_form, .update_option_content").submit(function(e){
        e.preventDefault();
    });

    /**
    *   DOCU: This will remove is-invalid class and .form_error elements
    *   Triggered: .on("keypress", "#title", function()
    *   Last Updated Date: September 3, 2021
    *   @author Jovic Abengona
    */
     $(document).on("keypress", "#title, #description", function(){
        $(this).removeClass("is-invalid");
        $(this).next(".form_error").remove();
    });

    /**
    *   DOCU: This will send a post request to update form title and/or description. 
    *   If return is false, an error message will be displayed
    *   Triggered: .on("blur", "#update_form_title_and_description", function()
    *   Last Updated Date: September 7, 2021
    *   @author Fitz, Updated By: Jovic Abengona
    */
    $(document).on("blur", "#update_form_title_and_description", function(){
        $.post($(this).attr("action"), $(this).serialize(), function(result){
            $(".form_error").remove();

            if(!result.status){
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

    /**
    *   DOCU: This will send a post request to update question. 
    *   If return is false, input field will have a style to indicate an error
    *   Triggered: .on("change", ".question_content_text", function()
    *   Last Updated Date: September 8, 2021
    *   @author Fitz, Updated By: Jovic Abengona
    */
    $(document).on("change", ".question_content_text", function(){
        question_content_input = $(this);
        question_id = $(this).attr("data-question-id");
        
        $.post($(`#question_${question_id}_form`).attr("action"), $(`#question_${question_id}_form`).serialize(), function(result) {
            if(!result["status"]) {
                question_content_input.addClass('is-invalid');
            }
            else {
                question_content_input.removeClass('is-invalid');
            }
        }, 'json');

        return false;
    });

    /**
    *   DOCU: This will send a post request to update option. 
    *   If return is false, input field will have a style to indicate an error
    *   Triggered: .on("change", ".option_content_text", function()
    *   Last Updated Date: September 8, 2021
    *   @author Fitz, Updated By: Jovic Abengona
    */
    $(document).on("change", ".option_content_text", function(){
        option_content_input = $(this);
        form_div = $(this).parent().parent();
        
        $.post(form_div.attr("action"), form_div.serialize(), function(result) {
            if(!result["status"]) {
               option_content_input.addClass('is-invalid');
            }
            else {
                option_content_input.removeClass('is-invalid');
            }
        }, 'json');

        return false;
    });

    /**
    *   DOCU: This will update the frontend and prepend checkboxes for input fields
    *   then send a post request to update form_type. 
    *   If return is false, input field will have a style to indicate an error
    *   Triggered: $("#quiz_mode_toggle").change(function()
    *   Last Updated Date: September 9, 2021
    *   @author Jovic Abengona | Updated by: Fitz
    */
    $("#quiz_mode_toggle").change(function(){
        is_quiz_mode = $(this).prop("checked");
        let modal_header_remove_class;
        let modal_header_add_class;
        let modal_title;
        let modal_body;
        let modal_footer;

        $("#quiz_mode_toggle_error").remove();

        $.post("/form/quiz_mode_toggle", { form_id: $(this).data("form-id"), quiz_mode_toggle: is_quiz_mode }, function(result){
            if(result["status"]){
                if(JSON.parse(result["is_quiz_mode"])){
                    modal_header_remove_class = "alert-warning";
                    modal_header_add_class = "text-success alert-success";
                    modal_title = "<i class='fas fa-check'></i> Success!";
                    modal_body = `
                        <p class="fw-bold">This form is now a quiz!</p>
                        <p>You can now set which option/s will serve as an answer for each question. You can also set the equivalent score for each question.</p>
                    `;
                    modal_footer = "<button type='button' class='btn btn-success' data-bs-dismiss='modal'>Okay</button>";

                    var x = 1;
                    var y = 1;

                    $(".type_multiple_choice input").each(function(){
                        $(this).before(`
                            <div class="input-group-text form_question_choice_answer">
                                <input name="form_question_${$(this).attr("data-choice-id")}_choice_${x}_quiz" class="form-check-input mt-0" type="checkbox">
                            </div>
                        `);

                        x++;
                    });

                    $(".type_checkbox input").each(function(){
                        $(this).before(`
                            <div class="input-group-text form_question_choice_answer">
                                <input name="form_question_${$(this).attr("data-choice-id")}_choice_${y}_quiz" class="form-check-input mt-0" type="checkbox">
                            </div>
                        `);

                        y++;
                    });
                    
                    $(".form_question").each(function(){
                        var question_id = $(this).attr("id").match(/\d+/)[0]

                        $(this).append(`
                            <div id="form_question_${question_id}_score_div" class="row my-2 score_field">
                                <label for="form[form_question_${question_id}_score]" class="col-lg-1 col-form-label">Score: </label>
                                <form action="/update_score" method="post">
                                    <input type="hidden" name="authenticity_token" value="${auth_token}">
                                    <input type="hidden" name="_method" value="patch">
                                    <input type="hidden" name="question[id]" value="${question_id}">
                                    <div class="col-lg-11 w-25">
                                        <input type="number" id="form[form_question_${question_id}_score]" name="question[score]" class="form-control score_text">
                                    </div>
                                </form>
                            </div>
                        `);
                    });
                }
                else{
                    modal_header_remove_class = "text-success alert-success";
                    modal_header_add_class = "alert-warning";
                    modal_title = "<i class='fas fa-exclamation-triangle'></i> Attention!";
                    modal_body = "<p class='fw-bold'>This form is no longer a quiz!</p>";
                    modal_footer = "<button type='button' class='btn btn-warning' data-bs-dismiss='modal'>Okay</button>";

                    $(".form_question").each(function(){

                        if($(this).attr("data-question-type") === "1" || $(this).attr("data-question-type") === "2"){
                            $(".form_question .row .form_question_choice_answer").remove();
                        }
        
                        $(".score_field").remove();
                    });
                }

                $("#quiz_toggle_modal .modal-header").removeClass(modal_header_remove_class);
                $("#quiz_toggle_modal .modal-header").addClass(modal_header_add_class);
                $("#quiz_toggle_modal .modal-title").html(modal_title);
                $("#quiz_toggle_modal .modal-body").html(modal_body);
                $("#quiz_toggle_modal .modal-footer").html(modal_footer);
                $("#quiz_toggle_modal").modal("show");
            }
            else{
                $("#breadcrumbs").after(`
                    <div id="quiz_mode_toggle_error" class="alert alert-danger" role="alert">
                        <i class="fas fa-times-circle"></i> An Error Occured!
                    </div>
                `);
            }
        });

        return false;
    });

    /**
    *   DOCU: This will send a get request to add a new question in default format
    *   If return is false, an error message will be displayed
    *   Triggered: $("#add_question_btn").click()
    *   Last Updated Date: September 9, 2021
    *   @author Jovic Abengona | Updated By: Fitz
    */
    $("#add_question_btn").click(function(){
        is_quiz_mode = $("#quiz_mode_toggle").prop("checked");

        $.get(`/add_question/${$(this).data("form-id")}`, function(result) {
            $("#sortable").append(`
                <div id="form_question_${result["question_id"]}_div" class="mb-3 p-4 border border-success rounded form_question" data-question-type="${result["question_id"]}">
                    <div class="row">
                        <div class="col-lg-9">
                            <form id="question_${result["question_id"]}_form" action="/update_question_content" method="post">
                                <input type="hidden" name="authenticity_token" value="${auth_token}">
                                <input type="hidden" name="_method" value="patch">
                                <input type="hidden" name="question[id]" value="${result["question_id"]}">
                                <div id="form_question_${result["question_id"]}_question_div" class="input-group mb-3">
                                    <input type="text" id="form_question_${result["question_id"]}" data-question-id="${result["question_id"]}" name="question[content]" class="form-control form-control-lg question_content_text" placeholder="Question Text">
                                    <button type="button" class="delete_question btn btn-sm btn-outline-danger" data-delete-id="${result["question_id"]}"><i class="far fa-trash-alt"></i> Delete</button>
                                </div>
                            </form>
                            <form action="/update_option_content" method="post" class="update_option_content">
                                <input type="hidden" name="authenticity_token" value="${auth_token}">
                                <input type="hidden" name="_method" value="patch">
                                <input type="hidden" name="option[id]" value="${result["option_id"]}">
                                <div id="form_question_${result["question_id"]}_choice_div" class="input-group mb-3 type_multiple_choice">
                                    <input type="text" id="form_question_${result["question_id"]}_choice_${result["option_id"]}" name="option[content]" class="form-control option_content_text" placeholder="Choice Text" data-choice-id=${result["option_id"]}>
                                    <button type="button" class="delete_choice btn btn-sm btn-outline-danger" data-delete-id="${result["option_id"]}"><i class="far fa-trash-alt"></i> Delete</button>
                                </div>
                            </form>
                            <div id="form_question_${result["question_id"]}_add_choice_other_div">
                                <a id="form_question_${result["question_id"]}_add_choice" class="add_choice text-decoration-none text-success" data-add-choice-id="${result["question_id"]}">Add Choice</a> <span id="form_question_${result["question_id"]}_add_other_div">or <a id="form_question_${result["question_id"]}_add_other" class="add_other text-decoration-none text-success" data-add-other-id="${result["question_id"]}">"Other"</a></span>
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <form id="form_question_${result["question_id"]}_change_type" action="/update_question_type" method="patch">
                                <input type="hidden" name="authenticity_token" value="${auth_token}">
                                <input type="hidden" name="_method" value="patch">
                                <input type="hidden" name="form[question_id]" value="${result["question_id"]}">
                                <select id="form_question_${result["question_id"]}_type" name="form[question_type]" class="form-select form_question_type" data-question-type-id="${result["question_id"]}">
                                    <option value="1" selected>Multiple Choice</option>
                                    <option value="2">Checkboxes</option>
                                    <option value="3">Short Answer</option>
                                    <option value="4">Paragraph</option>
                                </select>
                            </form>
                        </div>
                    </div>
                </div>
            `);

            if(is_quiz_mode){
                $(`#form_question_${result["question_id"]}_choice_div`).prepend(`
                    <div class="input-group-text form_question_choice_answer">
                        <input name="form_question_${result["question_id"]}_choice_${result["option_id"]}_quiz" class="form-check-input mt-0" type="checkbox">
                    </div>
                `);

                $(`#form_question_${result["question_id"]}_add_choice_other_div`).after(`
                    <div id="form_question_${result["question_id"]}_score_div" class="row my-2 score_field">
                        <label for="form[form_question_${result["question_id"]}_score]" class="col-lg-1 col-form-label">Score: </label>
                        <form action="/update_score" method="post">
                            <input type="hidden" name="authenticity_token" value="${auth_token}">
                            <input type="hidden" name="_method" value="patch">
                            <input type="hidden" name="question[id]" value="${result["question_id"]}">
                            <div class="col-lg-11 w-25">
                                <input type="number" id="form[form_question_${result["question_id"]}_score]" name="question[score]" class="form-control score_text">
                            </div>
                        </form>
                    </div>
                `);
            }
        }, 'json');
        return false;
    });

    // ADD CHOICE
    $(document).on("click", ".add_choice", function(){
        is_quiz_mode = $("#quiz_mode_toggle").prop("checked");
        let element;
        let class_type;
        let form_question_choice = "";
        let element_for_printing;
        let question_number = $(this).data("add-choice-id");

        $.get(`/add_option/${question_number}`, function(result){
            if(is_quiz_mode){
                form_question_choice += `
                    <div class="input-group-text form_question_choice_answer">
                        <input name="form_question_${question_number}_choice_${result["option_id"]}_quiz" class="form-check-input mt-0" type="checkbox">
                    </div>
                `;
            }
    
            if($(`#form_question_${question_number}_choice_div`).length > 0){
                element = "choice"
                if($(`#form_question_${question_number}_div`).attr("data-question-type") === "1"){
                    class_type = "multiple_choice"
                }
                else if($(`#form_question_${question_number}_div`).attr("data-question-type") === "2"){
                    class_type = "checkbox"
                }
            }
            else{
                element = "question"
                if($(`#form_question_${question_number}_div`).attr("data-question-type") === "1"){
                    class_type = "multiple_choice"
                }
                else if($(`#form_question_${question_number}_div`).attr("data-question-type") === "2"){
                    class_type = "checkbox"
                }
            }
            
            form_question_choice += `
                <input type="text" id="form_question_${question_number}_choice_${result["option_id"]}" name="option[content]" class="form-control option_content_text" placeholder="Choice Text" data-choice-id="${result["option_id"]}">
                <button type="button" class="delete_choice btn btn-sm btn-outline-danger" data-delete-id="${question_number}"><i class="far fa-trash-alt"></i> Delete</button>
            `;
            
            if($(`#form_question_${question_number}_div .update_option_content`).last().length > 0){
                element_for_printing = $(`#form_question_${question_number}_div .update_option_content`).last();
            }
            else{
                element_for_printing = $(`#question_${question_number}_form`);
            }
            
            element_for_printing.after(`
                <form action="/update_option_content" method="post" class="update_option_content">
                    <input type="hidden" name="authenticity_token" value="${auth_token}">
                    <input type="hidden" name="_method" value="patch">
                    <input type="hidden" name="option[id]" value="${result["option_id"]}">
                    <div id="form_question_${question_number}_choice_div" class="input-group mb-3 type_${class_type}">
                        ${form_question_choice}
                    </div>
                </form>
            `);
        }, 'json');

        return false;
    });

    // ADD OTHER
    $(document).on("click", ".add_other", function(){
        choice_counter += 1;

        $(`#form_question_${$(this).data("add-other-id")}_add_choice`).before(`
            <div id="form_question_${$(this).data("add-other-id")}_other_div" class="input-group mb-3">
                <span class="input-group-text">Other...</span>
                <input type="text" id="form_question_${question_counter}_choice_${choice_counter}" name="form[form_question_${question_counter}_choice_${choice_counter}]" class="form-control" readonly>
                <button type="button" class="delete_other btn btn-sm btn-outline-danger" data-delete-id="${$(this).data("add-other-id")}"><i class="far fa-trash-alt"></i> Delete</button>
            </div>
        `);

        $(`#form_question_${$(this).data("add-other-id")}_add_other_div`).hide();
    });

    /**
    *   DOCU: This will delete the question selected by the user
    *   Triggered: on("click", ".delete_choice")
    *   Last Updated Date: September 9, 2021
    *   @author Jovic Abengona | Updated by: Fitz
    */
    $(document).on("click", ".delete_question", function(){
        question_id = $(this).data("delete-id");
        form_id = $("#form_id").val();
        question_type_id = $(`#form_question_${question_id}_div`).data("question-type");

        $.ajax({
            url: "/delete_question",
            type: "delete",
            dataType: "json",
            data: { "id": question_id, "form_id": form_id, "question_type_id": question_type_id },
            success: function(data) { 
                $(`#form_question_${question_id}_div`).remove();;
            },
            error: function() { 
                alert("Error!")
            }
        });
    });

    /**
    *   DOCU: This will delete the option selected by the user
    *   Triggered: on("click", ".delete_choice")
    *   Last Updated Date: September 7, 2021
    *   @author Jovic Abengona | Updated by: Fitz
    */
    $(document).on("click", ".delete_choice", function(){
        option_id = $(this).data("delete-id");
        option_div = $(this).parent().parent();

        $.ajax({
            url: "/delete_option",
            type: "delete",
            dataType: "json",
            data: { "id": option_id },
            success: function(data) { 
                option_div.remove();
            },
            error: function() { 
                alert("Error!") 
            }
        })

    });

    // DELETE OTHER
    $(document).on("click", ".delete_other", function(){
        $(`#form_question_${$(this).data("delete-id")}_other_div`).remove();
        $(`#form_question_${$(this).data("delete-id")}_add_other_div`).show();
    });

    // CHANGE QUESTION TYPE
    $(document).on("change", ".form_question_type", function(){
        is_quiz_mode = $("#quiz_mode_toggle").prop("checked");
        let add_choice_other_content;
        let question_type_content;
        let question_type;

        select_question_type = $(this);
        form_div = $(`#form_question_${select_question_type.data("question-type-id")}_change_type`);
  
        $(`#form_question_${select_question_type.data("question-type-id")}_div`).attr("data-question-type", `${select_question_type.val()}`);
        
        $.post(form_div.attr('action'), form_div.serialize(), function(result) {
            console.log(result);

            if(select_question_type.val() === "1" || select_question_type.val() === "2"){
                if(select_question_type.val() === "1"){
                    question_type = "multiple_choice";
                    question_type_content_options = `
                        <option value="1" selected>Multiple Choice</option>
                        <option value="2">Checkboxes</option>
                    `;
                }
                else{
                    question_type = "checkbox";
                    question_type_content_options = `
                        <option value="1">Multiple Choice</option>
                        <option value="2" selected>Checkboxes</option>
                    `;
                }

                question_type_content = `
                    <div class="col-lg-3">
                        <form id="form_question_${result["question_id"]}_change_type" action="/update_question_type" method="patch">
                            <input type="hidden" name="authenticity_token" value="<%= form_authenticity_token %>">
                            <input type="hidden" name="_method" value="patch">
                            <input type="hidden" name="form[question_id]" value="${result["question_id"]}">
                            <select id="form_question_${result["question_id"]}_type" name="form[question_type]" class="form-select form_question_type" data-question-type-id="${select_question_type.data("question-type-id")}">
                                ${question_type_content_options}
                                <option value="3">Short Answer</option>
                                <option value="4">Paragraph</option>
                            </select>
                        </form>    
                    </div>
                `;
                
                add_choice_other_content = `
                    <div id="form_question_${result["question_id"]}_add_choice_other_div">
                        <a id="form_question_${result["question_id"]}_add_choice" class="add_choice text-decoration-none text-success" data-add-choice-id="${result["question_id"]}">Add Choice</a> <span id="form_question_${result["question_id"]}_add_other_div">or <a id="form_question_${result["question_id"]}_add_other" class="add_other text-decoration-none text-success" data-add-other-id="${result["question_id"]}">"Other"</a></span>
                    </div>
                `;
            }
            else if(select_question_type.val() === "3" || select_question_type.val() === "4"){
                add_choice_other_content = `
                    <div id="form_question_${result["question_id"]}_choice_div" class="input-group mb-3">
                        <input type="text" id="form_question_${result["question_id"]}_choice_1" name="form[form_question_${result["question_id"]}_choice_1]" class="form-control" placeholder="Choice Text" readonly>
                    </div>
                `;
    
                if(select_question_type.val() === "3"){
                    question_type_content_options = `
                        <option value="3" selected>Short Answer</option>
                        <option value="4">Paragraph</option>
                    `;
                }
                else{
                    question_type_content_options = `
                        <option value="3">Short Answer</option>
                        <option value="4" selected>Paragraph</option>
                    `;
                }

                question_type_content = `
                    <div class="col-lg-3">
                        <form id="form_question_${result["question_id"]}_change_type" action="/update_question_type" method="patch">
                            <input type="hidden" name="authenticity_token" value="<%= form_authenticity_token %>">
                            <input type="hidden" name="_method" value="patch">
                            <input type="hidden" name="form[question_id]" value="${result["question_id"]}">
                            <select id="form_question_${result["question_id"]}_type" name="form[question_type]" class="form-select form_question_type" data-question-type-id="${result["question_id"]}">
                                <option value="1">Multiple Choice</option>
                                <option value="2">Checkboxes</option>
                                ${question_type_content_options}
                            </select>
                        </form>  
                    </div>
                `;
            }
    
            $(`#form_question_${result["question_id"]}_div`).html(`
                <div class="row">
                    <div class="col-lg-9">
                        <form id="question_${result["question_id"]}_form" action="/update_question_content" method="post">
                            <input type="hidden" name="authenticity_token" value="${auth_token}">
                            <input type="hidden" name="_method" value="patch">
                            <input type="hidden" name="question[id]" value="${result["question_id"]}">
                            <div id="form_question_${result["question_id"]}_question_div" class="input-group mb-3">
                                <input type="text" id="form_question_${result["question_id"]}" data-question-id="${result["question_id"]}" name="question[content]" class="form-control form-control-lg question_content_text" placeholder="Question Text" value="${result["content"]}">
                                <button type="button" class="delete_question btn btn-sm btn-outline-danger" data-delete-id="${result["question_id"]}"><i class="far fa-trash-alt"></i> Delete</button>
                            </div>
                        </form>
                        ${add_choice_other_content}
                    </div>
                    ${question_type_content}
                </div>
            `);
    
            if(is_quiz_mode && (select_question_type.val() === "1" || select_question_type.val() === "2")){
                $(`#form_question_${result["question_id"]}_choice_div`).prepend(`
                    <div class="input-group-text form_question_choice_answer">
                        <input name="form_question_${result["question_id"]}_choice_${choice_counter}_quiz" class="form-check-input mt-0" type="checkbox">
                    </div>
                `);
    
                $(`#form_question_${result["question_id"]}_add_choice_other_div`).after(`
                    <div id="form_question_${result["question_id"]}_score_div" class="row my-2 score_field">
                        <label for="form[form_question_${result["question_id"]}_score]" class="col-lg-1 col-form-label">Score: </label>
                        <div class="col-lg-11 w-25">
                            <input type="number" id="form[form_question_${result["question_id"]}_score]" name="form[form_question_${result["question_id"]}_score]" class="form-control">
                        </div>
                    </div>
                `);
            }
            else if(is_quiz_mode && (select_question_type.val() === "3" || select_question_type.val() === "4")){
                $(`#form_question_${result["question_id"]}_choice_div`).after(`
                    <div id="form_question_${result["question_id"]}_score_div" class="row my-2 score_field">
                        <label for="form[form_question_${result["question_id"]}_score]" class="col-lg-1 col-form-label">Score: </label>
                        <div class="col-lg-11 w-25">
                            <input type="number" id="form[form_question_${result["question_id"]}_score]" name="form[form_question_${result["question_id"]}_score]" class="form-control">
                        </div>
                    </div>
                `);
            }
    
            $(`#form_question_${select_question_type.data("question-type-id")}_div`).attr("id", `form_question_${select_question_type.data("question-type-id")}_div`);
        }, 'json');
       
        return false;
    });

    /**
     * This will send a post request to update score of a question
     * If the result is false, input field will change style indication the input is invalid
     * Triggered: .on("change", ".score_text")
     * @author Fitz
     */
    $(document).on("change", ".score_text", function(){
        score_text_box = $(this);
        form_div = score_text_box.parent().parent();

        $.post(form_div.attr("action"), form_div.serialize(), function(result) {
            console.log(result);
            if(!result["status"]) {
                score_text_box.addClass('is-invalid');
            }
            else {
                score_text_box.removeClass('is-invalid');
            }
        }, 'json');

        return false;
    });
  
    $("#publish_form").submit(function(e){
        e.preventDefault();

        $("#publish_form_error").remove();
        
        $.post($(this).attr("action"), $(this).serialize(), function(result){
            console.log(result);
            if(result["status"]){

            }
            else{
                $("#breadcrumbs").after(`
                    <div id="publish_form_error" class="alert alert-danger" role="alert">
                        <i class="fas fa-times-circle"></i> An Error Occured!
                    </div>
                `);
            }
        });

        return false;
    })
});