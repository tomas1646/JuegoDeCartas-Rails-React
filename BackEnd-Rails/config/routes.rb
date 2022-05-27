Rails.application.routes.draw do

  resources :users, only: [:update] do
    collection do
      post :register
      post :login
      put :update_picture
    end
  end

end
