class Board < ApplicationRecord
  validates :player1, presence: true

  belongs_to :player1, class_name: 'User'
  belongs_to :player2, class_name: 'User', optional: true
  belongs_to :player3, class_name: 'User', optional: true
  belongs_to :player4, class_name: 'User', optional: true

  before_create :set_token

  enum board_status: {
    waiting_players: 0,
    full: 1,
    in_course: 2,
    player1_win: 3,
    player2_win: 4,
    player3_win: 5,
    player4_win: 6
  }

  enum round_status: {
    waiting_wins_asked: 0,
    waiting_card_throw: 1
  }

  def json
    { player1_name: player1.name,
      player2_name: player2 ? player2.name : '',
      player3_name: player3 ? player3.name : '',
      player4_name: player4 ? player4.name : '',
      board_status:, round_status: round_status || '',
      token:, players:,
      round_card_number:, curr_round_left:,
      wins: JSON.parse(wins),
      scores: JSON.parse(score),
      cards: JSON.parse(cards) }
  end

  def reset_cards
    self.cards = '["","","",""]'
  end

  def reset_wins
    self.wins = '["","","",""]'
  end

  def reset_player_cards
    self.player_cards = '{"1":[],"2":[],"3":[],"4":[]}'
  end

  def is_player_in_board(user)
    player1 == user || player2 == user || player3 == user || player4 == user
  end

  def start_game
    self.board_status = :in_course
    self.round_status = :waiting_wins_asked
    give_cards
  end

  def set_player_win(user, win_number)
    winsArray = JSON.parse wins

    winsArray[0] = win_number if player1 === user
    winsArray[1] = win_number if player2 === user
    winsArray[2] = win_number if player3 === user
    winsArray[3] = win_number if player4 === user

    self.wins = winsArray.to_json
  end

  def did_player_throw_card?(user)
    card_array = JSON.parse cards

    return card_array[0].present? if user == player1
    return card_array[1].present? if user == player2
    return card_array[2].present? if user == player3
    return card_array[3].present? if user == player4
  end

  def throw_card(user, card)
    card_array = JSON.parse cards
    map_player_cards = JSON.parse player_cards

    if user == player1
      card_array[0] = card
      map_player_cards['1'].delete(card)
    end

    if user == player2
      card_array[1] = card
      map_player_cards['2'].delete(card)
    end

    if user == player3
      card_array[2] = card
      map_player_cards['3'].delete(card)
    end

    if user == player4
      card_array[3] = card
      map_player_cards['4'].delete(card)
    end

    self.player_cards = map_player_cards.to_json
    self.cards = card_array.to_json
  end

  def join_board(user)
    if player2.blank?
      self.player2 = user
      self.players = 2
    elsif player3.blank?
      self.player3 = user
      self.players = 3
    else
      self.player4 = user
      self.players = 4
      self.board_status = :full
    end
  end

  def finish_round(new_round_number)
    if curr_round_left == 1
      self.round_status = :waiting_wins_asked
      self.round_card_number = new_round_number
      self.curr_round_left = new_round_number
      reset_wins
      give_cards
    else
      self.curr_round_left = curr_round_left - 1
    end

    reset_cards
  end

  def get_player_cards(user)
    card_array = []
    map_player_cards = JSON.parse player_cards

    card_array = map_player_cards['1'] if user == player1
    card_array = map_player_cards['2'] if user == player2
    card_array = map_player_cards['3'] if user == player3
    card_array = map_player_cards['4'] if user == player4

    card_array
  end

  def give_cards
    map_player_cards = {}

    players.times do |i|
      cards = []
      round_card_number.times do
        cards.push Deck.instance.get_card
      end
      map_player_cards[(i + 1).to_s] = cards
    end

    self.player_cards = map_player_cards.to_json
  end

  def finish_game(winner)
    self.round_status = nil

    self.board_status = :player1_win if winner == 1
    self.board_status = :player2_win if winner == 2
    self.board_status = :player3_win if winner == 3
    self.board_status = :player4_win if winner == 4
  end

  private

  def set_token
    self.token = SecureRandom.base58
  end
end
