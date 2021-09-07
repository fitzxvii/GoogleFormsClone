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
  get "/form/result" => "forms#result"
  get "/form/answer" => "forms#answer"

  get "/create_form" => "forms#create_form"
  get "/f/:code" => "forms#create"
  get "/f/:code/preview" => "forms#preview"
  get "/add_question/:form_id" => "forms#add_question"
  get "/add_option/:question_id" => "forms#add_option"
  get "/update_question_type/:question_id/:type_id" => "forms#update_question_type"

  post "/form/quiz_mode_toggle" => "forms#quiz_mode_toggle"

  patch "/form/rename/:id" => "forms#rename_form"
  patch "/form/save/:id/:code" => "forms#save_form"
  patch "/form/publish/:id/:code" => "forms#publish_form"
  delete "/form/delete/:id" => "forms#delete"
end