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

  patch "/form/rename/:id" => "forms#rename_form"
  patch "/form/publish/:id/:code" => "forms#publish_form"
  delete "/form/delete/:id" => "forms#delete"
end