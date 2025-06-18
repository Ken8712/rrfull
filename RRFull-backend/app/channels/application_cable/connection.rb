module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      # JWTトークンから認証
      token = request.params[:token] || request.headers['Authorization']&.split(' ')&.last
      
      if token
        begin
          jwt_payload = JWT.decode(token, Rails.application.credentials.devise_jwt_secret_key || SecureRandom.hex(64)).first
          User.find(jwt_payload['sub'])
        rescue JWT::DecodeError, ActiveRecord::RecordNotFound
          reject_unauthorized_connection
        end
      else
        reject_unauthorized_connection
      end
    end
  end
end
