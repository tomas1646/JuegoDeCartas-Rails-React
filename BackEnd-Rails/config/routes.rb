Rails.application.routes.draw do

  resources :users, only: [:create, :update] do
    collection do
      post :login
      put :update_picture
    end
  end

  resources :boards, only: [:index, :create, :show] do
    collection do
      get :cards
    end
    
    member do
      post :join
      post :start
      post :start_card_round
      post :wins
      post :update_score
      post :throw_card
      post :end_card_round
    end
  end

end
