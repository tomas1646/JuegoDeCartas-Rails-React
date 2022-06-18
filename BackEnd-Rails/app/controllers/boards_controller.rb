class BoardsController < ApplicationController  
  before_action :set_board, except: [:index, :cards]
  before_action :check_token, except: [:index, :show]

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
    if is_player_in_board @user
      return render_success_response(@board.json, 'Joined to the board')
    end

    if !@board.waiting_players?
      return render_error_response({}, 'Game Started. Cant join.')
    end

    @board.join_board @user

    if @board.save
      render_success_response(@board.json, 'Joined to the board')
    else
      render_error_response({}, "Error Joining Board #{board.errors.full_messages.join(', ')}")
    end
  end

  def start_game
    if @board.players === 1
      render_error_response({}, "There is only one player. Cant start game.")
    end

    @board.board_status = :in_course
    @board.round_status = :waiting_wins_asked

    if @board.save
      render_success_response(@board.json, 'Game Started')
    else
      render_error_response({}, "Error Starting Game #{board.errors.full_messages.join(', ')}")
    end
  end

  def start_card_round
    if !@board.waiting_wins_asked? 
      render_error_response({}, "Board isn't waiting for wins")
    end

    @board.round_status = :waiting_card_throw

    if @board.save
      render_success_response(@board.json, 'Board status change to Waiting Card Throw')
    else
      render_error_response({}, "Error Starting Game #{board.errors.full_messages.join(', ')}")
    end
  end

  def end_card_round
    if !@board.waiting_card_throw? 
      render_error_response({}, "Board isn't waiting card throw")
    end

    @board.round_status = :round_finished

    if @board.save
      render_success_response(@board.json, 'Board status change to Round Finished')
    else
      render_error_response({}, "Error Finishing Round #{board.errors.full_messages.join(', ')}")
    end
  end

  def update_score
    if @user != @board.player_1
      render_error_response({}, "Only player 1 can change scores")
    end

    @board.score = params[:scores].to_json
    
    if @board.save
      render_success_response(@board.json, 'Scores Updated')
    else
      render_error_response({}, "Error Updating Scores #{board.errors.full_messages.join(', ')}")
    end
  end

  def throw_card
    @board.throw_card @user, params[:card]
    
    if @board.save
      render_success_response(@board.json, 'Card Thrown')
    else
      render_error_response({}, "Error Throwing Card #{board.errors.full_messages.join(', ')}")
    end
  end

  def cards
    card_array = []

    for i in 1..params[:card_number].to_i
      card_array.push(Deck.instance.get_card)
    end

    render_success_response(card_array)
  end

  def wins
    @board.set_player_win @user, params[:wins]
    
    if @board.save
      render_success_response(@board.json, 'Win Number Set')
    else
      render_error_response({}, "Error setting win number #{board.errors.full_messages.join(', ')}")
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
end
