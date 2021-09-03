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
  get "/dashboard/create" => "forms#create"
  get "/form" => "forms#view"
  get "/form/result" => "forms#result"
  get "/form/answer" => "forms#answer"
end