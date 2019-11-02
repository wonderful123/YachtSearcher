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

  task :stats => :environment do
    puts "\n", "-" * 70, "\n"
    puts "#{Pastel.new.green 'Sites: '} \t #{Site.count}"
    puts "#{Pastel.new.yellow 'Boats: '} \t #{Boat.count}"
    puts "#{Pastel.new.yellow 'Listings: '} \t #{Listing.count}"
    puts "#{Pastel.new.yellow 'Histories: '} \t #{History.count}"
    puts "#{Pastel.new.yellow 'Regions: '} \t #{Region.count}"
    puts "#{Pastel.new.yellow 'Images: '} \t #{total_images(Listing.all)}"
    puts "\n", "-" * 70, "\n"

    Site.all.each { |s|
      site_name = Pastel.new.cyan s.name
      images = total_images(Listing.where(site_id: s.id))
      puts "%-30s Listings: #{Listing.where(site_id: s.id).count} \t Images: #{images}" % site_name
    }
    puts "\n", "-" * 70, "\n"
  end

  def total_images(listings)
    total_images = 0
    listings.each { |l|
      total_images += l.images.length
      total_images +=1 if !l.thumbnail.nil?
    }

    return total_images
  end
end
