class Board < ApplicationRecord
  MAXPLAYERS = 4
  validates :player1, presence: true

  belongs_to :player1, class_name: 'User'
  belongs_to :player2, class_name: 'User', optional: true
  belongs_to :player3, class_name: 'User', optional: true
  belongs_to :player4, class_name: 'User', optional: true

  before_create :set_token

  enum board_status: {
    waiting_players: 0,
    full: 1,
    waiting_wins_asked: 2,
    waiting_card_throw: 3,
    player1_win: 4,
    player2_win: 5,
    player3_win: 6,
    player4_win: 7
  }

  def json
    { player1_name: player1.name,
      player2_name: player2 ? player2.name : '',
      player3_name: player3 ? player3.name : '',
      player4_name: player4 ? player4.name : '',
      board_status:, token:, players:,
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
    self.player_cards = '{"p1":[],"p2":[],"p3":[],"p4":[]}'
  end

  def is_player_in_board(user)
    player1 == user || player2 == user || player3 == user || player4 == user
  end

  def start_game
    self.board_status = :waiting_wins_asked
    deal_cards
  end

  def set_player_win(user, win_number)
    winsArray = JSON.parse wins
    user_id = user.id

    players.times do |i|
      winsArray[i] = win_number if user_id == read_attribute("player#{i + 1}_id")
    end

    self.wins = winsArray.to_json
  end

  def did_player_throw_card?(user)
    card_array = JSON.parse cards
    user_id = user.id

    players.times do |i|
      return card_array[i].present? if user_id == read_attribute("player#{i + 1}_id")
    end
  end

  def throw_card(user, card)
    card_array = JSON.parse cards
    map_player_cards = JSON.parse player_cards, symbolize_names: true
    user_id = user.id

    players.times do |i|
      if user_id == read_attribute("player#{i + 1}_id")
        card_array[i] = card
        map_player_cards["p#{i + 1}".to_sym].delete(card)
      end
    end

    self.player_cards = map_player_cards.to_json
    self.cards = card_array.to_json
  end

  def join_board(user)
    1.upto(MAXPLAYERS) do |i|
      next unless read_attribute("player#{i}_id").blank?

      send("player#{i}=", user)
      self.players += 1
      self.board_status = :full if MAXPLAYERS == i
      return
    end
  end

  def finish_round(new_round_number)
    if curr_round_left == 1
      self.board_status = :waiting_wins_asked
      self.round_card_number = new_round_number
      self.curr_round_left = new_round_number
      reset_wins
      deal_cards
    else
      self.curr_round_left = curr_round_left - 1
    end

    reset_cards
  end

  def get_player_cards(user)
    card_array = []
    map_player_cards = JSON.parse player_cards, symbolize_names: true
    user_id = user.id

    players.times do |i|
      card_array = map_player_cards["p#{i + 1}".to_sym] if user_id == read_attribute("player#{i + 1}_id")
    end

    card_array
  end

  def deal_cards
    map_player_cards = {}

    1.upto(players) do |i|
      cards = []
      round_card_number.times do
        cards.push Deck.instance.get_card
      end
      map_player_cards["p#{i}".to_sym] = cards
    end

    self.player_cards = map_player_cards.to_json
  end

  def finish_game(winner)
    send('board_status=', "player#{winner}_win".to_sym)
  end

  private

  def set_token
    self.token = SecureRandom.base58
  end
end
