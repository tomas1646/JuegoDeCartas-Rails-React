class CreateBoards < ActiveRecord::Migration[7.0]
  def change
    create_table :boards do |t|
      t.belongs_to :player_1, class_name: "User"
      t.belongs_to :player_2, class_name: "User"
      t.belongs_to :player_3, class_name: "User"
      t.belongs_to :player_4, class_name: "User"

      t.boolean :player_1_lost, default: false
      t.boolean :player_2_lost, default: false
      t.boolean :player_3_lost, default: false
      t.boolean :player_4_lost, default: false

      t.string :token
      t.string :score, default: "[\"\",\"\",\"\",\"\"]"
      t.string :cards, default: "[\"\",\"\",\"\",\"\"]"
      t.integer :status, default: 0
      t.integer :players

      t.timestamps
    end
  end
end
