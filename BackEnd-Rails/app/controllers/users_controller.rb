class UsersController < ApplicationController
  before_action :check_token, only: [:update, :current, :update_picture]

  def update
    @user.assign_attributes(user_params)

    if @user.save
      render_success_response(@user.json, 'User Updated')
    else
      render_error_response({}, "Error updating User #{@user.errors.full_messages.join(', ')}")
    end
  end

  def update_picture
    if @user.avatar.attached?
      @user.avatar.purge
    end

    @user.avatar.attach(params[:avatar])
    
    if @user.save
      render_success_response(@user.json, 'Picture Updated')
    else
      render_error_response({}, "Error updating Picture #{@user.errors.full_messages.join(', ')}")
    end
  end

  def current
    render_success_response(@user.json)
  end

  def register
    user = User.new(user_params)

    if user.save
      render_success_response(user.json, 'User Created')
    else
      render_error_response({}, "Error creating User #{user.errors.full_messages.join(', ')}")
    end
  end

  def login
    user = User.find_by(user_name: params[:user_name])

    if user.blank? || user.password != params[:password]
      render_error_response({}, 'Incorrect Username or Password')
    else
      render_success_response(user.json, 'Login successful')
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :password, :user_name)
  end

  def check_token
    @user = User.find_by(token: request.headers['Authorization'])
    return if @user.present?

    render_error_response({}, "User with token #{request.headers['Authorization']} doesn't exists", 404)
  end
end
