class Board < ApplicationRecord
    validates :player_1_id, :players, presence: true

    belongs_to :player_1, class_name: 'User'
    belongs_to :player_2, class_name: 'User', optional: true
    belongs_to :player_3, class_name: 'User', optional: true
    belongs_to :player_4, class_name: 'User', optional: true
  
    before_create :set_token
  
    enum status: { 
        Waiting_Players: 0, 
        Dealing: 1,
        Waiting_Card_Throw: 2,
        Round_Finished: 3,
        Player_1_Win: 4, 
        Player_2_Win: 5,
        Player_3_Win: 6, 
        Player_4_Win: 7}
  
    def json
      { player_1_name: player_1.name, 
        player_2_name: player_2 ? player_2.name : '',
        player_3_name: player_3 ? player_3.name : '',
        player_4_name: player_4 ? player_4.name : '',
        status:, token:, players:,
        score: JSON.parse(score), cards: JSON.parse(cards) }
    end
  
    def reset_cards
        self.cards = "[\"\",\"\",\"\",\"\"]"
    end

    private
  
    def set_token
      self.token = SecureRandom.base58
    end
end
