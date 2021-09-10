Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root "sessions#new"

  # SESSION ROUTES
  post "/login" => "sessions#create"
  delete "/sessions/:id" => "sessions#destroy"

  # USER ROUTES
  get "/signup" => "users#signup"
  post "/register" => "users#register"

  # FORMS ROUTES
  get "/dashboard" => "forms#dashboard"
  #get "/dashboard/create" => "forms#create"
  get "/form" => "forms#view"
  get "/form/:code/result" => "forms#result"
  get "/form/answer" => "forms#answer"

  get "/create_form" => "forms#create_form"
  get "/f/:code" => "forms#create"
  get "/f/:code/preview" => "forms#preview"
  get "/add_option/:question_id" => "forms#add_option"
  get "/add_others_option/:question_id" => "forms#add_others_option"
  
  patch "/add_question" => "forms#add_question"
  patch "/form/update_question_order" => "forms#update_question_order"
  patch "/update_question_type" => "forms#update_question_type"
  patch "/update_form_title_and_description" => "forms#update_form_title_and_description"

  patch "/update_form_title" => "forms#update_form_title"
  patch "/update_form_description" => "forms#update_form_description"
  patch "/update_question_content" => "forms#update_question_content"
  patch "/update_option_content" => "forms#update_option_content"

  delete "/delete_option" => "forms#delete_option"
  delete "/delete_question" => "forms#delete_question"

  post "/form/quiz_mode_toggle" => "forms#quiz_mode_toggle"
  patch "/update_score" => "forms#update_score"
  patch "/update_correct_answer" => "forms#update_correct_answer"

  patch "/form/rename" => "forms#rename_form"
  patch "/form/publish" => "forms#publish_form"
  patch "/form/get_result" => "forms#get_result"
  delete "/form/delete" => "forms#delete"
end