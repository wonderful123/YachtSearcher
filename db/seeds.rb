# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Site.find_or_create_by({name: 'yachthub', url: 'https://www.yachthub.com'})
Site.find_or_create_by({name: 'yoti', url: 'https://www.yoti.com.au'})
Site.find_or_create_by({name: 'sailboatlistings', url: 'https://www.sailboatlistings.com'})
