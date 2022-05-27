class User < ApplicationRecord
  validates :name, :user_name, :password, presence: true
  validates :user_name, uniqueness: true

  before_create :set_token
  has_one_attached :avatar

  def json
    {name:, user_name:, avatar_url: self.avatar.attached? ? Rails.application.routes.url_helpers.rails_blob_path(self.avatar, only_path: true) : "", token:}
  end
  
  private

  def set_token
    self.token = SecureRandom.uuid
  end
end
