class CreateBoards < ActiveRecord::Migration[7.0]
  def change
    create_table :boards do |t|
      t.string :token
      t.string :score
      t.string :cards
      t.string :wins
      t.string :player_cards
      t.string :winner
      t.integer :status, default: 0
      t.integer :round_card_number, default: 3
      t.integer :curr_round_left, default: 3

      t.timestamps
    end
  end
end
