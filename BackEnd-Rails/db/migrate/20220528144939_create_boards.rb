class CreateBoards < ActiveRecord::Migration[7.0]
  def change
    create_table :boards do |t|
      t.belongs_to :player_1, class_name: "User"
      t.belongs_to :player_2, class_name: "User"
      t.belongs_to :player_3, class_name: "User"
      t.belongs_to :player_4, class_name: "User"

      t.string :token
      t.string :score, default: "[\"\",\"\",\"\",\"\"]"
      t.string :cards, default: "[\"\",\"\",\"\",\"\"]"
      t.string :wins, default: "[\"\",\"\",\"\",\"\"]"
      t.integer :board_status, default: 0
      t.integer :round_status
      t.integer :players
      t.integer :curr_round, default: 3

      t.timestamps
    end
  end
end
