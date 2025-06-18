class InteractionState < ApplicationRecord
  # アソシエーション
  belongs_to :interaction
  belongs_to :user
  
  # 定数
  VALID_STATUSES = %w[happy thinking stressed neutral].freeze
  
  # バリデーション
  validates :status, inclusion: { in: VALID_STATUSES, allow_nil: true }
  validates :counter, numericality: { greater_than_or_equal_to: 0 }
end
