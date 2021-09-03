class User < ApplicationRecord
  include ::QueryHelper

  EMAIL_REGEX = /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]+)\z/i

  validates :name, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }, format: { with: EMAIL_REGEX }
  validates :password, presence: true, confirmation: { case_sensitive: true }

  def self.get_user(user_id)
    query_record(["SELECT first_name, last_name, email FROM users WHERE id = ?", user_id])
  end
end
