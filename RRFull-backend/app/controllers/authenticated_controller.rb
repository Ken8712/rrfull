class AuthenticatedController < ApplicationController
  before_action :authenticate_user!
  
  private
  
  # 現在のユーザー
  def current_user
    @current_user ||= warden.authenticate(scope: :user)
  end
  
  # 認証チェック
  def authenticate_user!
    unless user_signed_in?
      render json: { error: '認証が必要です' }, status: :unauthorized
    end
  end
  
  # ユーザーがサインインしているか
  def user_signed_in?
    current_user.present?
  end
end