class CreateBoardPlayers < ActiveRecord::Migration[7.0]
  def change
    create_table :board_players do |t|
      t.belongs_to :board
      t.belongs_to :user

      t.timestamps
    end
  end
end
