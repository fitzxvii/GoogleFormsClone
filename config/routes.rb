Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root "sessions#new"

  get "/signup" => "users#signup"

  # FORMS ROUTES
  get "/dashboard" => "forms#dashboard"
  get "/dashboard/create" => "forms#create"
  get "/form" => "forms#view"
  get "/form/result" => "forms#result"
  get "/form/answer" => "forms#answer"

  get "/create_form" => "forms#create_form"
end