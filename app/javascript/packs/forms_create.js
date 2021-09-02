$(document).ready(function(){
    let is_quiz_mode;
    let question_counter = 1;
    let choice_counter = 1;

    $("#sortable").sortable();
    $("#sortable").disableSelection();

    $("#create_form").submit(function(e){
        e.preventDefault();
    });

    // CHECK QUIZ MODE TOGGLE
    $("#quiz_mode_toggle").change(function(){
        var class_type;
        var counter = 1;
        is_quiz_mode = $(this).prop("checked")

        $(".form_question").each(function(){
            var question_id = $(this).attr("id").match(/\d+/g)[0];           

            if(is_quiz_mode){ 
                if($(this).attr("data-question-type") === "1"){
                    class_type = "multiple_choice"
                }
                else if($(this).attr("data-question-type") === "2"){
                    class_type = "checkbox"
                }
                
                if($(`.form_question .row .type_${class_type} .form_question_choice_answer`).length === 0){
                    //console.log($(`.form_question .row .type_${class_type} .form-control`).attr('id').match(/\d+/g))

                    $(`.form_question .row .type_${class_type}`).each(function() {
                        var choice_question_id = $(this).find('.form-control').attr('id').match(/\d+/g)[0];
                        var choice_id = $(this).find('.form-control').attr('id').match(/\d+/g)[1];

                        $(this).prepend(`
                            <div class="input-group-text form_question_choice_answer">
                                <input name="form_question_${choice_question_id}_choice_${choice_id}_quiz" class="form-check-input mt-0" type="checkbox">
                            </div>
                        `);
                    });
                }

                $(this).append(
                    `<div id="form_question_${question_id}_score_div" class="input-group my-2">
                        <input type="text" placeholder="Score" name="form[form_question_${question_id}_score] class="form-control form-control-lg"">
                    </div>`
                  );

                counter += 1;        
            }
            else{
                if($(this).attr("data-question-type") === "1" || $(this).attr("data-question-type") === "2"){
                    $(".form_question .row .form_question_choice_answer").remove();
                }

                $(`#form_question_${question_id}_score_div`).remove();
            }
        });
    });

    // ADD QUESTION
    $("#add_question_btn").click(function(){
        question_counter += 1;

        $("#sortable").append(`
            <div id="form_question_${question_counter}_div" class="mb-3 p-4 border border-success rounded form_question" data-question-type="1">
                <div class="row">
                    <div class="col-lg-9">
                        <div id="form_question_${question_counter}_question_div" class="input-group mb-3">
                            <input type="text" id="form_question_${question_counter}" name="form[form_question_${question_counter}]" class="form-control form-control-lg" placeholder="Question Text">
                            <button class="delete_question btn btn-sm btn-outline-danger" data-delete-id="${question_counter}"><i class="far fa-trash-alt"></i> Delete</button>
                        </div>
                        <div id="form_question_${question_counter}_choice_div" class="input-group mb-3 type_multiple_choice">
                            <input type="text" id="form_question_${question_counter}_choice_1" name="form[form_question_${question_counter}_choice_1]" class="form-control" placeholder="Choice Text">
                            <button class="delete_choice btn btn-sm btn-outline-danger" data-delete-id="${question_counter}"><i class="far fa-trash-alt"></i> Delete</button>
                        </div>
                        <div id="form_question_${question_counter}_add_choice_other_div">
                            <a id="form_question_${question_counter}_add_choice" class="add_choice text-decoration-none text-success" data-add-choice-id="${question_counter}">Add Choice</a> <span id="form_question_${question_counter}_add_other_div">or <a id="form_question_${question_counter}_add_other" class="add_other text-decoration-none text-success" data-add-other-id="${question_counter}">"Other"</a></span>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <select id="form_question_${question_counter}_type" name="form[question_type]" class="form-select form_question_type" data-question-type-id="${question_counter}">
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
            $(`#form_question_${question_counter}_choice_div`).prepend(`
                <div class="input-group-text form_question_choice_answer">
                    <input name="form_question_${question_counter}_choice_1_quiz" class="form-check-input mt-0" type="checkbox">
                </div>
            `);

            $(`#form_question_${question_counter}_div`).append(
                `<div id="form_question_${question_counter}_score_div" class="input-group my-2">
                    <input type="text" placeholder="Score" name="form[form_question_${question_counter}_score] class="form-control form-control-lg"">
                </div>`
            );
        }
    });

    // ADD CHOICE
    $(document).on("click", ".add_choice", function(){
        choice_counter += 1;
        var element;
        var class_type;
        var form_question_choice_answer;

        if(is_quiz_mode){
            form_question_choice_answer = `
                <div class="input-group-text form_question_choice_answer">
                    <input name="form_question_${$(this).data("add-choice-id")}_choice_${choice_counter}_quiz" class="form-check-input mt-0" type="checkbox">
                </div>
            `;
        }
        else{
            form_question_choice_answer = undefined;
        }

        if($(`#form_question_${$(this).data("add-choice-id")}_choice_div`).length > 0){
            element = "choice"
            if($(`#form_question_${$(this).data("add-choice-id")}_div`).attr("data-question-type") === "1"){
                class_type = "multiple_choice"
            }
            else if($(`#form_question_${$(this).data("add-choice-id")}_div`).attr("data-question-type") === "2"){
                class_type = "checkbox"
            }
        }
        else{
            element = "question"
            if($(`#form_question_${$(this).data("add-choice-id")}_div`).attr("data-question-type") === "1"){
                class_type = "multiple_choice"
            }
            else if($(`#form_question_${$(this).data("add-choice-id")}_div`).attr("data-question-type") === "2"){
                class_type = "checkbox"
            }
        }
        
        if(form_question_choice_answer != undefined){
            $(`#form_question_${$(this).data("add-choice-id")}_${element}_div`).after(`
                <div id="form_question_${$(this).data("add-choice-id")}_choice_div" class="input-group mb-3 type_${class_type}">
                    ${form_question_choice_answer}
                    <input type="text" id="form_question_${$(this).data("add-choice-id")}_choice_${choice_counter}" name="form[form_question_${$(this).data("add-choice-id")}_choice_${choice_counter}]" class="form-control" placeholder="Choice Text">
                    <button class="delete_choice btn btn-sm btn-outline-danger" data-delete-id="${$(this).data("add-choice-id")}"><i class="far fa-trash-alt"></i> Delete</button>
                </div>
            `);
        }
        else{
            $(`#form_question_${$(this).data("add-choice-id")}_${element}_div`).after(`
                <div id="form_question_${$(this).data("add-choice-id")}_choice_div" class="input-group mb-3 type_${class_type}">
                    <input type="text" id="form_question_${$(this).data("add-choice-id")}_choice_${choice_counter}" name="form[form_question_${$(this).data("add-choice-id")}_choice_${choice_counter}]" class="form-control" placeholder="Choice Text">
                    <button class="delete_choice btn btn-sm btn-outline-danger" data-delete-id="${$(this).data("add-choice-id")}"><i class="far fa-trash-alt"></i> Delete</button>
                </div>
            `);
        }
        
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
        question_counter += 1;

        $(`#form_question_${$(this).data("question-type-id")}_div`).attr("data-question-type", `${$(this).val()}`);

        if($(this).val() === "1" || $(this).val() === "2"){
            choice_content = `
                <div id="form_question_${question_counter}_choice_div" class="input-group mb-3 type_multiple_choice">
                    <input type="text" id="form_question_${question_counter}_choice_1" name="form[form_question_${question_counter}_choice_1]" class="form-control" placeholder="Choice Text">
                    <button class="delete_choice btn btn-sm btn-outline-danger" data-delete-id="${question_counter}"><i class="far fa-trash-alt"></i> Delete</button>
                </div>
                <div id="form_question_${question_counter}_add_choice_other_div">
                    <a id="form_question_${question_counter}_add_choice" class="add_choice text-decoration-none text-success" data-add-choice-id="${question_counter}">Add Choice</a> <span id="form_question_${question_counter}_add_other_div">or <a id="form_question_${question_counter}_add_other" class="add_other text-decoration-none text-success" data-add-other-id="${question_counter}">"Other"</a></span>
                </div>
            `;

            if($(this).val() === "1"){
                question_type_content = `
                    <div class="col-lg-3">
                        <select id="form_question_${question_counter}_type" name="form[question_type]" class="form-select form_question_type" data-question-type-id="${question_counter}">
                            <option value="1" selected>Multiple Choice</option>
                            <option value="2">Checkboxes</option>
                            <option value="3">Short Answer</option>
                            <option value="4">Paragraph</option>
                        </select>
                    </div>
                `;
            }
            else{
                question_type_content = `
                    <div class="col-lg-3">
                        <select id="form_question_${question_counter}_type" name="form[question_type]" class="form-select form_question_type" data-question-type-id="${question_counter}">
                            <option value="1">Multiple Choice</option>
                            <option value="2" selected>Checkboxes</option>
                            <option value="3">Short Answer</option>
                            <option value="4">Paragraph</option>
                        </select>
                    </div>
                `;
            }
        }
        else if($(this).val() === "3" || $(this).val() === "4"){
            choice_content = `
                <div id="form_question_${question_counter}_choice_div" class="input-group mb-3">
                    <input type="text" id="form_question_${question_counter}_choice_1" name="form[form_question_${question_counter}_choice_1]" class="form-control" placeholder="Choice Text" readonly>
                </div>
            `;

            if($(this).val() === "3"){
                question_type_content = `
                    <div class="col-lg-3">
                        <select id="form_question_${question_counter}_type" name="form[question_type]" class="form-select form_question_type" data-question-type-id="${question_counter}">
                            <option value="1">Multiple Choice</option>
                            <option value="2">Checkboxes</option>
                            <option value="3" selected>Short Answer</option>
                            <option value="4">Paragraph</option>
                        </select>
                    </div>
                `;
            }
            else{
                question_type_content = `
                    <div class="col-lg-3">
                        <select id="form_question_${question_counter}_type" name="form[question_type]" class="form-select form_question_type" data-question-type-id="${question_counter}">
                            <option value="1">Multiple Choice</option>
                            <option value="2">Checkboxes</option>
                            <option value="3">Short Answer</option>
                            <option value="4" selected>Paragraph</option>
                        </select>
                    </div>
                `;
            }
        }

        $(`#form_question_${$(this).data("question-type-id")}_div`).html(`
            <div class="row">
                <div class="col-lg-9">
                    <div id="form_question_${question_counter}_question_div" class="input-group mb-3">
                        <input type="text" id="form_question_${question_counter}" name="form[form_question_${question_counter}]" class="form-control form-control-lg" placeholder="Question Text">
                        <button class="delete_question btn btn-sm btn-outline-danger" data-delete-id="${question_counter}"><i class="far fa-trash-alt"></i> Delete</button>
                    </div>
                    ${choice_content}
                </div>
                ${question_type_content}
            </div>
        `);

        if(is_quiz_mode && ($(this).val() === "1" || $(this).val() === "2")){
            $(`#form_question_${question_counter}_choice_div`).prepend(`
                <div class="input-group-text form_question_choice_answer">
                    <input name="form_question_${question_counter}_choice_${choice_counter}_quiz" class="form-check-input mt-0" type="checkbox">
                </div>
            `);
        }

        $(`#form_question_${$(this).data("question-type-id")}_div`).attr("id", `form_question_${question_counter}_div`);
    });
});