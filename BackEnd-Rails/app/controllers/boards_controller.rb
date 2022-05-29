class BoardsController < ApplicationController  
  before_action :set_board, only: %i[show join move]
  before_action :check_token, only: %i[create join find_user_boards find_user_open_boards move]

  def index
    boards = Board.all
    render_success_response(boards.preload(:player_1, :player_2, :player_3, :player_4).map { |board| board.json })
  end

  def show
    render_success_response(@board.json)
  end

  def create
    board = Board.new(player_1: @user, players: params[:players])
    if board.save
      render_success_response(board.json, 'Board Created')
    else
      render_error_response({}, "Error creating Board #{board.errors.full_messages.join(', ')}")
    end
  end

  
  def join
    if @board.player_1 == @user || @board.player_2 == @user || @board.player_3 == @user || @board.player_4 == @user
      return render_success_response(@board.json, 'Joined to the board')
    end

    if @board.player_1.present? && @board.player_2.present? && @board.player_3.present? && @board.player_4.present?
      return render_error_response({}, 'Board is full') 
    end

    if @board.player_2.blank?
        @board.player_2 = @user
    else
        if @board.player_3.blank?
            @board.player_3 = @user
        else
            @board.player_4 = @user
            @board.status = :Dealing
        end
    end
    

    if @board.save
      render_success_response(@board.json, 'Joined to the board')
    else
      render_error_response({}, "Error Joining Board #{board.errors.full_messages.join(', ')}")
    end
  end


  private

  def set_board
    @board = Board.find_by(token: params[:id])
    return if @board.present?

    render_error_response({}, "Board doesn't exists", 404)
  end

  def check_token
    @user = User.find_by(token: request.headers['Authorization'])
    return if @user.present?

    render_error_response({}, "User with token #{request.headers['Authorization']} doesn't exists", 404)
  end

  def check_win

  end
end
