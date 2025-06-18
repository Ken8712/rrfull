class StateEvent < ApplicationRecord
  # アソシエーション
  belongs_to :interaction
  belongs_to :user
  
  # バリデーション
  validates :status, inclusion: { in: InteractionState::VALID_STATUSES, allow_nil: true }
  validates :counter, numericality: { greater_than_or_equal_to: 0, allow_nil: true }
end
