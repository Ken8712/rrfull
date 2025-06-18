class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  private

  # サインアップ成功時のレスポンス
  def respond_with(resource, _opts = {})
    register_success && return if resource.persisted?

    register_failed
  end

  def register_success
    render json: {
      message: 'アカウントが作成されました',
      user: UserSerializer.new(current_user).serializable_hash[:data][:attributes]
    }, status: :ok
  end

  def register_failed
    render json: { 
      message: "アカウントの作成に失敗しました", 
      errors: resource.errors.full_messages 
    }, status: :unprocessable_entity
  end
  
  # パラメータの許可
  def sign_up_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end