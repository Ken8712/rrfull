class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  
  # Deviseモジュール設定
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self
         
  # バリデーション
  validates :name, presence: true
  
  # アソシエーション
  has_many :interaction_states
  has_many :state_events
  
  # コールバック
  before_create :generate_jti
  
  private
  
  # JWT用のjti生成
  def generate_jti
    self.jti = SecureRandom.uuid
  end
end
