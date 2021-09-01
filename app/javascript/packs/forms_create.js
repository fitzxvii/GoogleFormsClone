$(document).ready(function(){
    let question_counter = 1;
    let choice_counter = 1;

    $("#create_form").submit(function(e){
        e.preventDefault();
    });

    // ADD QUESTION
    $("#add_question_btn").click(function(){
        question_counter += 1;

        $(this).before(`
            <div id="form_question_${question_counter}_div" class="mb-3">
                <div class="row">
                    <div class="col-lg-9">
                        <div id="form_question_${question_counter}_question_div" class="input-group mb-3">
                            <input type="text" id="form_question_${question_counter}" name="form[form_question_${question_counter}]" class="form-control form-control-lg" placeholder="Question Text">
                            <button class="delete_question btn btn-sm btn-outline-danger" data-delete-id="${question_counter}"><i class="far fa-trash-alt"></i> Delete</button>
                        </div>
                        <div id="form_question_${question_counter}_choice_div" class="input-group mb-3">
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
    });

    // ADD CHOICE
    $(document).on("click", ".add_choice", function(){
        choice_counter += 1;

        if($(`#form_question_${$(this).data("add-choice-id")}_choice_div`).length > 0){
            $(`#form_question_${$(this).data("add-choice-id")}_choice_div`).after(`
                <div id="form_question_${question_counter}_choice_div" class="input-group mb-3">
                    <input type="text" id="form_question_${$(this).data("add-choice-id")}_choice_${choice_counter}" name="form[form_question_${$(this).data("add-choice-id")}_choice_${choice_counter}]" class="form-control" placeholder="Choice Text">
                    <button class="delete_choice btn btn-sm btn-outline-danger" data-delete-id="${question_counter}"><i class="far fa-trash-alt"></i> Delete</button>
                </div>
            `);
        }
        else{
            $(`#form_question_${$(this).data("add-choice-id")}_question_div`).after(`
                <div id="form_question_${question_counter}_choice_div" class="input-group mb-3">
                    <input type="text" id="form_question_${$(this).data("add-choice-id")}_choice_${choice_counter}" name="form[form_question_${$(this).data("add-choice-id")}_choice_${choice_counter}]" class="form-control" placeholder="Choice Text">
                    <button class="delete_choice btn btn-sm btn-outline-danger" data-delete-id="${question_counter}"><i class="far fa-trash-alt"></i> Delete</button>
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
        question_counter += 1;

        if($(this).val() === "1"){
            $(`#form_question_${$(this).data("question-type-id")}_div`).html(`
                <div id="form_question_${question_counter}_div" class="mb-3">
                    <div class="row">
                        <div class="col-lg-9">
                            <div id="form_question_${question_counter}_question_div" class="input-group mb-3">
                                <input type="text" id="form_question_${question_counter}" name="form[form_question_${question_counter}]" class="form-control form-control-lg" placeholder="Question Text">
                                <button class="delete_question btn btn-sm btn-outline-danger" data-delete-id="${question_counter}"><i class="far fa-trash-alt"></i> Delete</button>
                            </div>
                            <div id="form_question_${question_counter}_choice_div" class="input-group mb-3">
                                <input type="text" id="form_question_${question_counter}_choice_1" name="form[form_question_${question_counter}_choice_1]" class="form-control" placeholder="Choice Text">
                                <button class="delete_choice btn btn-sm btn-outline-danger" data-delete-id="${question_counter}"><i class="far fa-trash-alt"></i> Delete</button>
                            </div>
                            <div id="form_question_${question_counter}_add_choice_other_div">
                                <a id="form_question_${question_counter}_add_choice" class="add_choice text-decoration-none text-success" data-add-choice-id="${question_counter}">Add Choice</a> <span id="form_question_${question_counter}_add_other_div">or <a id="form_question_${question_counter}_add_other" class="add_other text-decoration-none text-success" data-add-other-id="${question_counter}">"Other"</a></span>
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <select id="form_question_${question_counter}_type" name="form[question_type]" class="form-select form_question_type" data-question-type-id="${question_counter}">
                                <option value="1" selected>Multiple Choice</option>
                                <option value="2">Checkboxes</option>
                                <option value="3">Short Answer</option>
                                <option value="4">Paragraph</option>
                            </select>
                        </div>
                    </div>
                </div>
            `);
        }
        else if($(this).val() === "2"){
            $(`#form_question_${$(this).data("question-type-id")}_div`).html(`
                <div id="form_question_${question_counter}_div" class="mb-3">
                    <div class="row">
                        <div class="col-lg-9">
                            <div id="form_question_${question_counter}_question_div" class="input-group mb-3">
                                <input type="text" id="form_question_${question_counter}" name="form[form_question_${question_counter}]" class="form-control form-control-lg" placeholder="Question Text">
                                <button class="delete_question btn btn-sm btn-outline-danger" data-delete-id="${question_counter}"><i class="far fa-trash-alt"></i> Delete</button>
                            </div>
                            <div id="form_question_${question_counter}_choice_div" class="input-group mb-3">
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
                                <option value="2" selected>Checkboxes</option>
                                <option value="3">Short Answer</option>
                                <option value="4">Paragraph</option>
                            </select>
                        </div>
                    </div>
                </div>
            `);
        }
        else if($(this).val() === "3"){
            $(`#form_question_${$(this).data("question-type-id")}_div`).html(`
                <div id="form_question_${question_counter}_div" class="mb-3">
                    <div class="row">
                        <div class="col-lg-9">
                            <div id="form_question_${question_counter}_question_div" class="input-group mb-3">
                                <input type="text" id="form_question_${question_counter}" name="form[form_question_${question_counter}]" class="form-control form-control-lg" placeholder="Question Text">
                                <button class="delete_question btn btn-sm btn-outline-danger" data-delete-id="${question_counter}"><i class="far fa-trash-alt"></i> Delete</button>
                            </div>
                            <div id="form_question_${question_counter}_choice_div" class="input-group mb-3">
                                <input type="text" id="form_question_${question_counter}_choice_1" name="form[form_question_${question_counter}_choice_1]" class="form-control" placeholder="Choice Text" readonly>
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <select id="form_question_${question_counter}_type" name="form[question_type]" class="form-select form_question_type" data-question-type-id="${question_counter}">
                                <option value="1">Multiple Choice</option>
                                <option value="2">Checkboxes</option>
                                <option value="3" selected>Short Answer</option>
                                <option value="4">Paragraph</option>
                            </select>
                        </div>
                    </div>
                </div>
            `);
        }
        else if($(this).val() === "4"){
            $(`#form_question_${$(this).data("question-type-id")}_div`).html(`
            <div id="form_question_${question_counter}_div" class="mb-3">
            <div class="row">
                <div class="col-lg-9">
                    <div id="form_question_${question_counter}_question_div" class="input-group mb-3">
                        <input type="text" id="form_question_${question_counter}" name="form[form_question_${question_counter}]" class="form-control form-control-lg" placeholder="Question Text">
                        <button class="delete_question btn btn-sm btn-outline-danger" data-delete-id="${question_counter}"><i class="far fa-trash-alt"></i> Delete</button>
                    </div>
                    <div id="form_question_${question_counter}_choice_div" class="input-group mb-3">
                        <input type="text" id="form_question_${question_counter}_choice_1" name="form[form_question_${question_counter}_choice_1]" class="form-control" placeholder="Choice Text" readonly>
                    </div>
                </div>
                <div class="col-lg-3">
                    <select id="form_question_${question_counter}_type" name="form[question_type]" class="form-select form_question_type" data-question-type-id="${question_counter}">
                        <option value="1">Multiple Choice</option>
                        <option value="2">Checkboxes</option>
                        <option value="3">Short Answer</option>
                        <option value="4" selected>Paragraph</option>
                    </select>
                </div>
            </div>
        </div>
            `);
        }
    });
});