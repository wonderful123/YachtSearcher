require 'pastel'

namespace :database do
  task :confirm do
    confirm_token = rand(24**3).to_s(24)
    STDOUT.puts "Are you sure you want to #{Pastel.new.red 'reset the database'}? Enter '#{confirm_token}' to confirm:"
    input = STDIN.gets.chomp
    raise "Aborting database reset. You entered #{input}" unless input == confirm_token
  end

  desc "Deletes all from database."

  task :delete_all => [:confirm, :environment] do
    puts "Histories: #{History.count} \t deleting..."
    History.delete_all
    puts "Listings: #{Listing.count} \t deleting..."
    Listing.delete_all
    puts "Regions: #{Region.count} \t deleting..."
    Region.delete_all
    puts "Boats: #{Boat.count} \t deleting..."
    Boat.delete_all
    puts "#{Pastel.new.yellow 'Confirmation'} - Boats:#{Boat.count} Listings:#{Listing.count} Regions:#{Region.count} History:#{History.count}"
  end
end
