# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)


# rails db:drop db:create db:migrate db:seed

user = User.create(name: "Tomas E", user_name:"tomas1646", password: "1234")
User.create(name: "usuario1", user_name:"usuario1", password: "1234")
User.create(name: "usuario2", user_name:"usuario2", password: "1234")
User.create(name: "usuario3", user_name:"usuario3", password: "1234")

Board.create(player_1: user, players: 4)