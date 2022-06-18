# rails db:drop db:create db:migrate db:seed

user = User.create(name: "Tomas E", user_name:"tomas1646", password: "1234")
user1 = User.create(name: "usuario1", user_name:"usuario1", password: "1234")
User.create(name: "usuario2", user_name:"usuario2", password: "1234")
User.create(name: "usuario3", user_name:"usuario3", password: "1234")

Board.create(player_1: user, player_2: user1, players: 2)