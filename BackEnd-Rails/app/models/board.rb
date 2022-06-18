class Board < ApplicationRecord
    validates :player_1_id, :players, presence: true

    belongs_to :player_1, class_name: 'User'
    belongs_to :player_2, class_name: 'User', optional: true
    belongs_to :player_3, class_name: 'User', optional: true
    belongs_to :player_4, class_name: 'User', optional: true
  
    before_create :set_token
  
    enum board_status: {
      waiting_players: 0, 
      full: 1,
      in_course: 2,
      player_1_win: 3, 
      player_2_win: 4,
      player_3_win: 5, 
      player_4_win: 6
    }

    enum round_status: { 
        dealing: 0,
        waiting_wins_asked:1,
        waiting_card_throw: 2,
        round_finished: 3,
       }
  
    def json
      { player_1_name: player_1.name, 
        player_2_name: player_2 ? player_2.name : '',
        player_3_name: player_3 ? player_3.name : '',
        player_4_name: player_4 ? player_4.name : '',
        board_status:, round_status:, token:, players:, 
        wins: JSON.parse(wins),
        scores: JSON.parse(score), cards: JSON.parse(cards) }
    end
  
    def reset_cards
        self.cards = "[\"\",\"\",\"\",\"\"]"
    end

    def is_player_in_board user
      player_1 == user || player_2 == @ser || player_3 == user || player_4 == user
    end

    def set_player_win user, win_number
      winsArray = JSON.parse wins

      if player_1 === user
        winsArray[0] = win_number
      end
      if player_2 === user
        winsArray[1] = win_number
      end
      if player_3 === user
        winsArray[2] = win_number
      end
      if player_4 === user
        winsArray[3] = win_number
      end

      self.wins = winsArray.to_json
    end

    def throw_card user, card
      card_array = JSON.parse cards

      if user == player_1
        card_array[0] = card
      end
      if user == player_2
        card_array[1] = card
      end
      if user == player_3
        card_array[2] = card
      end
      if user == player_4
        card_array[3] = card
      end

      self.cards = card_array.to_json
    end

    def join_board user
      if player_2.blank?
        self.player_2 = user
        self.players = 2
      else
          if player_3.blank?
              self.player_3 = user
              self.players = 3
           else
              self.player_4 = user
              self.players = 4
              self.board_status = :full
          end
      end
    end

    private
  
    def set_token
      self.token = SecureRandom.base58
    end
end
