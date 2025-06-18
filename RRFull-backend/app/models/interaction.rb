class Interaction < ApplicationRecord
  # アソシエーション
  has_many :interaction_states, dependent: :destroy
  has_many :state_events, dependent: :destroy
  has_many :users, through: :interaction_states
  
  # バリデーション
  validates :code, presence: true, uniqueness: true
  
  # コールバック
  before_create :generate_code
  
  private
  
  # セッションコードの生成（6文字の英数字）
  def generate_code
    self.code = loop do
      random_code = SecureRandom.alphanumeric(6).upcase
      break random_code unless self.class.exists?(code: random_code)
    end
  end
end
