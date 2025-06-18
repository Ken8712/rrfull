Rails.application.routes.draw do
  # Devise認証ルート
  devise_for :users,
    path: '',
    path_names: {
      sign_in: 'login',
      sign_out: 'logout',
      registration: 'signup'
    },
    controllers: {
      sessions: 'users/sessions',
      registrations: 'users/registrations'
    }
  
  # インタラクション関連のAPI
  resources :interactions, only: [:create, :show] do
    member do
      get 'counter'
      patch 'counter'
      patch 'state'
    end
  end
  
  # Action Cableのマウント
  mount ActionCable.server => '/cable'
  
  # ヘルスチェック
  get "up" => "rails/health#show", as: :rails_health_check
end
