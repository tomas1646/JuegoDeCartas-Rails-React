Rails.application.routes.draw do

  resources :users, only: [:update] do
    collection do
      post :register
      post :login
      put :update_picture
      get :current
    end
  end

  resources :boards, only: [:index, :create, :show] do
    member do 
      #post :join
      #post :move
    end
    
    collection do
      #get :find_open_boards
      #get :find_user_boards
      #get :find_user_open_boards
    end
  end
end
