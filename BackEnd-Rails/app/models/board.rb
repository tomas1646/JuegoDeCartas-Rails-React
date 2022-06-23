class Board < ApplicationRecord
  MAXPLAYERS = 4

  has_many :board_players
  has_many :players, through: :board_players, source: :user

  before_create :set_token

  enum status: {
    waiting_players: 0,
    full: 1,
    waiting_wins_asked: 2,
    waiting_card_throw: 3,
    finished: 4
  }

  def json
    data = {
      status:, token:, winner: winner || '',
      players: players.size,
      round_card_number:, curr_round_left:,
      wins: wins.present? ? JSON.parse(wins) : [],
      scores: score.present? ? JSON.parse(score) : [],
      cards: cards.present? ? JSON.parse(cards) : []
    }

    players.each_with_index do |player, index|
      data["player#{index + 1}_name".to_sym] = player.name
    end

    data
  end

  def reset_cards
    empty_arr = []
    empty_arr.fill('', 0, players.size)
    self.cards = empty_arr.to_json
  end

  def reset_wins
    empty_arr = []
    empty_arr.fill('', 0, players.size)
    self.wins = empty_arr.to_json
  end

  def reset_player_cards
    empty_hash = {}
    players.size.times { |i| empty_hash["p#{i + 1}".to_sym] = [] }
    self.player_cards = empty_hash
  end

  def is_player_in_board(user)
    players.include?(user)
  end

  def start_game
    self.status = :waiting_wins_asked
    reset_cards
    reset_wins
    reset_player_cards

    deal_cards
  end

  def set_player_win(user, win_number)
    wins_array = JSON.parse wins
    user_id = user.id

    players.each_with_index do |player, index|
      wins_array[index] = win_number if player == user
    end

    self.wins = wins_array.to_json
  end

  def did_player_throw_card?(user)
    card_array = JSON.parse cards
    user_id = user.id

    players.each_with_index do |player, index|
      return card_array[index].present? if player == user
    end
  end

  def throw_card(user, card)
    card_array = JSON.parse cards
    map_player_cards = JSON.parse player_cards, symbolize_names: true
    user_id = user.id

    players.each_with_index do |player, index|
      if player == user
        card_array[index] = card
        map_player_cards["p#{index + 1}".to_sym].delete(card)
      end
    end

    self.player_cards = map_player_cards.to_json
    self.cards = card_array.to_json
  end

  def join_board(user)
    players.push(user)

    self.status = :full if players.size == MAXPLAYERS
  end

  def finish_round(new_round_number)
    if curr_round_left == 1
      self.status = :waiting_wins_asked
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

    players.each_with_index do |player, index|
      return map_player_cards["p#{index + 1}".to_sym] if player == user
    end

    card_array
  end

  def deal_cards
    map_player_cards = {}

    players.size.times do |i|
      cards = []
      round_card_number.times do
        random_card = Deck.instance.get_card
        random_card = Deck.instance.get_card while cards.include?(random_card)
        cards.push random_card
      end
      map_player_cards["p#{i + 1}".to_sym] = cards
    end

    self.player_cards = map_player_cards.to_json
  end

  def end_game(winner)
    self.winner = winner
    self.status = :finished
  end

  private

  def set_token
    self.token = SecureRandom.base58
  end
end
