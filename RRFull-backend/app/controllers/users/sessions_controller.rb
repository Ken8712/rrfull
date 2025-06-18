class Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  # ログイン成功時のレスポンス
  def respond_with(resource, _opts = {})
    render json: {
      message: 'ログインしました',
      user: UserSerializer.new(resource).serializable_hash[:data][:attributes]
    }, status: :ok
  end

  # ログアウト成功時のレスポンス
  def respond_to_on_destroy
    if current_user
      render json: {
        message: "ログアウトしました"
      }, status: :ok
    else
      render json: {
        message: "ユーザーが見つかりません"
      }, status: :unauthorized
    end
  end
end