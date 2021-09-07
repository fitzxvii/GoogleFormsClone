$(document).ready(function(){
    let question_counter = 1;
    let choice_counter = 1;

    $("#sortable").sortable();
    $("#sortable").disableSelection();

    $("#create_form").submit(function(e){
        e.preventDefault();
    });

    // UPDATE FORM TITLE
    $("#form_title_text").change(function() {
        form_div = $(this).parent();

        $.post(form_div.attr("action"), form_div.serialize(), function(result) {
            console.log(result);
        }, 'json');

        return false;
    });

    // UPDATE FORM DESCRIPTION
    $("#form_description_textarea").change(function() {
        form_div = $(this).parent();

        $.post(form_div.attr("action"), form_div.serialize(), function(result) {
            console.log(result);
        }, 'json');

        return false;
    });

    // CHECK QUIZ MODE TOGGLE
    $("#quiz_mode_toggle").change(function(){
        let is_quiz_mode = $(this).prop("checked");

        if(is_quiz_mode){
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
                    <div id="form_question_${question_id}_score_div" class="input-group my-2 score_field">
                        <input type="text" placeholder="Score" name="form[form_question_${question_id}_score] class="form-control form-control-lg"">
                    </div>
                `);
            });

            $.post("/form/quiz_mode_toggle", { form_id: $(this).data("form-id"), quiz_mode_toggle: true }, function(result){
                console.log(result);
            });
        }
        else{
            $(".form_question").each(function(){

                if($(this).attr("data-question-type") === "1" || $(this).attr("data-question-type") === "2"){
                    $(".form_question .row .form_question_choice_answer").remove();
                }

                $(".score_field").remove();
            });

            $.post("/form/quiz_mode_toggle", { form_id: $(this).data("form-id"), quiz_mode_toggle: false }, function(result){
                console.log(result);
            });
        }
    });

    // ADD QUESTION
    $("#add_question_btn").click(function(){

        $.get(`/add_question/${$(this).data("form-id")}`, function(result) {
            $("#sortable").append(`
                <div id="form_question_${result["question_id"]}_div" class="mb-3 p-4 border border-success rounded form_question" data-question-type="${result["question_id"]}">
                    <div class="row">
                        <div class="col-lg-9">
                            <div id="form_question_${result["question_id"]}_question_div" class="input-group mb-3">
                                <input type="text" id="form_question_${result["question_id"]}" name="form[form_question_${result["question_id"]}]" class="form-control form-control-lg" placeholder="Question Text">
                                <button class="delete_question btn btn-sm btn-outline-danger" data-delete-id="${result["question_id"]}"><i class="far fa-trash-alt"></i> Delete</button>
                            </div>
                            <div id="form_question_${result["question_id"]}_choice_div" class="input-group mb-3 type_multiple_choice">
                                <input type="text" id="form_question_${result["question_id"]}_choice_${result["option_id"]}" name="form[form_question_${result["question_id"]}_choice_${result["option_id"]}]" class="form-control" placeholder="Choice Text" data-choice-id=${result["option_id"]}>
                                <button class="delete_choice btn btn-sm btn-outline-danger" data-delete-id="${result["option_id"]}"><i class="far fa-trash-alt"></i> Delete</button>
                            </div>
                            <div id="form_question_${result["question_id"]}_add_choice_other_div">
                                <a id="form_question_${result["question_id"]}_add_choice" class="add_choice text-decoration-none text-success" data-add-choice-id="${result["question_id"]}">Add Choice</a> <span id="form_question_${result["question_id"]}_add_other_div">or <a id="form_question_${result["question_id"]}_add_other" class="add_other text-decoration-none text-success" data-add-other-id="${result["question_id"]}">"Other"</a></span>
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <select id="form_question_${result["question_id"]}_type" name="form[question_type]" class="form-select form_question_type" data-question-type-id="${result["question_id"]}">
                                <option value="1">Multiple Choice</option>
                                <option value="2">Checkboxes</option>
                                <option value="3">Short Answer</option>
                                <option value="4">Paragraph</option>
                            </select>
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
                    <div id="form_question_${result["question_id"]}_score_div" class="input-group my-2 score_field">
                        <input type="text" placeholder="Score" name="form[form_question_${result["question_id"]}_score] class="form-control form-control-lg"">
                    </div>
                `);
            }
        }, 'json');
        return false;
    });

    // ADD CHOICE
    $(document).on("click", ".add_choice", function(){
        let is_quiz_mode = $("#quiz_mode_toggle").prop("checked");
        let element;
        let class_type;
        let form_question_choice_answer;
        let question_number = $(this).data("add-choice-id");

        $.get(`/add_option/${question_number}`, function(result) {
            if(is_quiz_mode){
                form_question_choice_answer = `
                    <div class="input-group-text form_question_choice_answer">
                        <input name="form_question_${question_number}_choice_${result["option_id"]}_quiz" class="form-check-input mt-0" type="checkbox">
                    </div>
                `;
            }
            else{
                form_question_choice_answer = undefined;
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
            
            if(form_question_choice_answer != undefined){
                $(`#form_question_${question_number}_${element}_div`).after(`
                    <div id="form_question_${question_number}_choice_div" class="input-group mb-3 type_${class_type}">
                        ${form_question_choice_answer}
                        <input type="text" id="form_question_${question_number}_choice_${result["option_id"]}" name="form[form_question_${question_number}_choice_${result["option_id"]}]" class="form-control" placeholder="Choice Text" data-choice-id="${result["option_id"]}">
                        <button class="delete_choice btn btn-sm btn-outline-danger" data-delete-id="${question_number}"><i class="far fa-trash-alt"></i> Delete</button>
                    </div>
                `);
            }
            else{
                $(`#form_question_${question_number}_${element}_div`).after(`
                    <div id="form_question_${question_number}_choice_div" class="input-group mb-3 type_${class_type}">
                        <input type="text" id="form_question_${question_number}_choice_${result["option_id"]}" name="form[form_question_${question_number}_choice_${result["option_id"]}]" class="form-control" placeholder="Choice Text" data-choice-id="${result["option_id"]}">
                        <button class="delete_choice btn btn-sm btn-outline-danger" data-delete-id="${question_number}"><i class="far fa-trash-alt"></i> Delete</button>
                    </div>
                `);
            }
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
                <button class="delete_other btn btn-sm btn-outline-danger" data-delete-id="${$(this).data("add-other-id")}"><i class="far fa-trash-alt"></i> Delete</button>
            </div>
        `);

        $(`#form_question_${$(this).data("add-other-id")}_add_other_div`).hide();
    });

    // DELETE QUESTION
    $(document).on("click", ".delete_question", function(){
        $(`#form_question_${$(this).data("delete-id")}_div`).remove();
    });

    // DELETE CHOICE
    $(document).on("click", ".delete_choice", function(){
        $(`#form_question_${$(this).data("delete-id")}_choice_div`).remove();
    });

    // DELETE OTHER
    $(document).on("click", ".delete_other", function(){
        $(`#form_question_${$(this).data("delete-id")}_other_div`).remove();
        $(`#form_question_${$(this).data("delete-id")}_add_other_div`).show();
    });

    // CHANGE QUESTION TYPE
    $(document).on("change", ".form_question_type", function(){
        var choice_content;
        var question_type_content;
        var question_type;

        select_question_type = $(this);
        form_div = $(`#form_question_${select_question_type.data("question-type-id")}_change_type`);
  
        $(`#form_question_${select_question_type.data("question-type-id")}_div`).attr("data-question-type", `${select_question_type.val()}`);
        
        $.post(form_div.attr('action'), form_div.serialize(), function(result) {
            console.log(result);

            if(select_question_type.val() === "1" || select_question_type.val() === "2"){
                if(select_question_type.val() === "1"){
                    question_type = "multiple_choice";
                    question_type_content = `
                        <form id="form_question_${select_question_type.data("question-type-id")}_change_type" action="/update_question_type" method="patch">
                            <input type="hidden" name="authenticity_token" value="<%= form_authenticity_token %>">
                            <input type="hidden" name="_method" value="patch">
                            <input type="hidden" name="form[question_id]" value="${select_question_type.data("question-type-id")}">
                            <div class="col-lg-3">
                                <select id="form_question_${select_question_type.data("question-type-id")}_type" name="form[question_type]" class="form-select form_question_type" data-question-type-id="${select_question_type.data("question-type-id")}">
                                    <option value="1" selected>Multiple Choice</option>
                                    <option value="2">Checkboxes</option>
                                    <option value="3">Short Answer</option>
                                    <option value="4">Paragraph</option>
                                </select>
                            </div>
                        </form>    
                    `;
                }
                else{
                    question_type = "checkbox";
                    question_type_content = `
                        <form id="form_question_${select_question_type.data("question-type-id")}_change_type" action="/update_question_type" method="patch">
                            <input type="hidden" name="authenticity_token" value="<%= form_authenticity_token %>">
                            <input type="hidden" name="_method" value="patch">
                            <input type="hidden" name="form[question_id]" value="${select_question_type.data("question-type-id")}">
                            <div class="col-lg-3">
                                <select id="form_question_${select_question_type.data("question-type-id")}_type" name="form[question_type]" class="form-select form_question_type" data-question-type-id="${select_question_type.data("question-type-id")}">
                                    <option value="1">Multiple Choice</option>
                                    <option value="2" selected>Checkboxes</option>
                                    <option value="3">Short Answer</option>
                                    <option value="4">Paragraph</option>
                                </select>
                            </div>
                        </form>  
                    `;
                }
    
                choice_content = `
                    <div id="form_question_${select_question_type.data("question-type-id")}_choice_div" class="input-group mb-3 type_${select_question_type.data("question-type-id")}">
                        <input type="text" id="form_question_${select_question_type.data("question-type-id")}_choice_1" name="form[form_question_${select_question_type.data("question-type-id")}_choice_1]" class="form-control" placeholder="Choice Text" data-choice-id=1>
                        <button class="delete_choice btn btn-sm btn-outline-danger" data-delete-id="${select_question_type.data("question-type-id")}"><i class="far fa-trash-alt"></i> Delete</button>
                    </div>
                    <div id="form_question_${select_question_type.data("question-type-id")}_add_choice_other_div">
                        <a id="form_question_${select_question_type.data("question-type-id")}_add_choice" class="add_choice text-decoration-none text-success" data-add-choice-id="${select_question_type.data("question-type-id")}">Add Choice</a> <span id="form_question_${select_question_type.data("question-type-id")}_add_other_div">or <a id="form_question_${select_question_type.data("question-type-id")}_add_other" class="add_other text-decoration-none text-success" data-add-other-id="${select_question_type.data("question-type-id")}">"Other"</a></span>
                    </div>
                `;
            }
            else if(select_question_type.val() === "3" || select_question_type.val() === "4"){
                choice_content = `
                    <div id="form_question_${select_question_type.data("question-type-id")}_choice_div" class="input-group mb-3">
                        <input type="text" id="form_question_${select_question_type.data("question-type-id")}_choice_1" name="form[form_question_${select_question_type.data("question-type-id")}_choice_1]" class="form-control" placeholder="Choice Text" readonly>
                    </div>
                `;
    
                if(select_question_type.val() === "3"){
                    question_type_content = `
                        <form id="form_question_${select_question_type.data("question-type-id")}_change_type" action="/update_question_type" method="patch">
                            <input type="hidden" name="authenticity_token" value="<%= form_authenticity_token %>">
                            <input type="hidden" name="_method" value="patch">
                            <input type="hidden" name="form[question_id]" value="${select_question_type.data("question-type-id")}">
                            <div class="col-lg-3">
                                <select id="form_question_${select_question_type.data("question-type-id")}_type" name="form[question_type]" class="form-select form_question_type" data-question-type-id="${select_question_type.data("question-type-id")}">
                                    <option value="1">Multiple Choice</option>
                                    <option value="2">Checkboxes</option>
                                    <option value="3" selected>Short Answer</option>
                                    <option value="4">Paragraph</option>
                                </select>
                            </div>
                        </form>  
                    `;
                }
                else{
                    question_type_content = `
                        <form id="form_question_${select_question_type.data("question-type-id")}_change_type" action="/update_question_type" method="patch">
                            <input type="hidden" name="authenticity_token" value="<%= form_authenticity_token %>">
                            <input type="hidden" name="_method" value="patch">
                            <input type="hidden" name="form[question_id]" value="${select_question_type.data("question-type-id")}">
                            <div class="col-lg-3">
                                <select id="form_question_${select_question_type.data("question-type-id")}_type" name="form[question_type]" class="form-select form_question_type" data-question-type-id="${select_question_type.data("question-type-id")}">
                                    <option value="1">Multiple Choice</option>
                                    <option value="2">Checkboxes</option>
                                    <option value="3" selected>Short Answer</option>
                                    <option value="4">Paragraph</option>
                                </select>
                            </div>
                        </form>  
                    `;
                }
            }
    
            $(`#form_question_${select_question_type.data("question-type-id")}_div`).html(`
                <div class="row">
                    <div class="col-lg-9">
                        <div id="form_question_${select_question_type.data("question-type-id")}_question_div" class="input-group mb-3">
                            <input type="text" id="form_question_${select_question_type.data("question-type-id")}" name="form[form_question_${select_question_type.data("question-type-id")}]" class="form-control form-control-lg" placeholder="Question Text">
                            <button class="delete_question btn btn-sm btn-outline-danger" data-delete-id="${select_question_type.data("question-type-id")}"><i class="far fa-trash-alt"></i> Delete</button>
                        </div>
                        ${choice_content}
                    </div>
                    ${question_type_content}
                </div>
            `);
    
            if(is_quiz_mode && (select_question_type.val() === "1" || select_question_type.val() === "2")){
                $(`#form_question_${select_question_type.data("question-type-id")}_choice_div`).prepend(`
                    <div class="input-group-text form_question_choice_answer">
                        <input name="form_question_${select_question_type.data("question-type-id")}_choice_${choice_counter}_quiz" class="form-check-input mt-0" type="checkbox">
                    </div>
                `);
    
                $(`#form_question_${select_question_type.data("question-type-id")}_add_choice_other_div`).after(`
                    <div id="form_question_${select_question_type.data("question-type-id")}_score_div" class="input-group my-2 score_field">
                        <input type="text" placeholder="Score" name="form[form_question_${select_question_type.data("question-type-id")}_score] class="form-control form-control-lg"">
                    </div>
                `);
            }
            else if(is_quiz_mode && (select_question_type.val() === "3" || select_question_type.val() === "4")){
                $(`#form_question_${select_question_type.data("question-type-id")}_choice_div`).after(`
                    <div id="form_question_${select_question_type.data("question-type-id")}_score_div" class="input-group my-2 score_field">
                        <input type="text" placeholder="Score" name="form[form_question_${select_question_type.data("question-type-id")}_score] class="form-control form-control-lg"">
                    </div>
                `);
            }
    
            $(`#form_question_${select_question_type.data("question-type-id")}_div`).attr("id", `form_question_${select_question_type.data("question-type-id")}_div`);
        }, 'json');
       
        return false;
    });

});