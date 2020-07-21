# frozen_string_literal: true

OPENCAGE_GEOCODE_API_KEY = '1373a948f572402db84b6abc40498a08'
MAX_GEOCODE_API_PER_SECOND = 1 # How often service can be accessed

# Boat records track geocoding with is_geocoded attribute.
# => nil: not geocoded yet
# => false: unable to geocode - no result or no location given
# => true: successful geocode

namespace :database do
  require 'opencage/geocoder'

  desc 'Geocodes boat locations (Args: amount=[ALL/number to geocode])'

  # Checks user input then geocodes boat locations
  task geocode: :environment do
    # Setup geocoder
    geocoder = OpenCage::Geocoder.new(api_key: OPENCAGE_GEOCODE_API_KEY)
    # Get boat records to geocode
    boats = boats_to_geocode

    # Hold loop update information
    counter = OpenStruct.new(
      total_boats: boats.count,
      boats_updated: 0, # boats updated
      current: 0, # loop iterator of current boat being updated
      start_time: 0 # loop timer
    )

    # Update each boat
    boats.each do |boat|
      counter = init_update(counter, boat)
      next unless geocode_boat(boat, geocoder)

      limit_api_request(counter.start_time)
      counter.boats_updated += 1
    end

    STDOUT.puts "[#{counter.boats_updated}/#{counter.total_boats}] boats successfully geocoded."
  end

  # Starts counter and timer at beginning of boat update
  def init_update(counter, boat)
    counter.current += 1
    counter.start_timer = Time.new # Time how often to do API request
    STDOUT.puts "Geocoding boat [#{counter.current}/#{counter.total_boats}] ID##{boat.id} \
    Location: '#{boat.location}'"

    return counter
  end

  # Sleep if necessary to avoid API hammering
  def limit_api_request(start_time)
    remaining_time = (1 / MAX_GEOCODE_API_PER_SECOND.to_f) -
                     (Time.new - start_time).to_f
    sleep remaining_time if remaining_time.positive?
  end

  # Returns the boats to be geocoded. Gets the input from arguments or input
  # prompt then queries the records needed
  #
  # @return Rails Boat records that are notn yet geocoded
  def boats_to_geocode
    # Check arguments or user input for number of boats to geocode
    amount = input_amount
    # Geocode all that are ungeocoded (is_geocoded: nil)
    Boat.where(is_geocoded: nil).limit(amount)
  end

  # Takes a boat record and uses location string to access geocode service then
  # updates record with data
  #
  # @retun [Boolean] true if saved, false if failed
  def geocode_boat(boat, geocoder)
    # Set boat.is_geocoded to false if no location provided
    unless boat.location
      boat.is_geocoded = false
      boat.save
      return false
    end

    # Try geocode boat location
    begin
      results = geocoder.geocode(boat.location)
    rescue e
      STDOUT.puts "Couldn't geocode boat location: #{boat.location} - #{e}"
    end

    # Check if no results from geocoding
    if results.length.zero?
      boat.is_geocoded = false
      boat.save
      return false
    end

    # Take first result of successful geocode
    data = extract_data(results.first)
    boat.update_attributes(data)
    boat.is_geocoded = true
    boat.save
  end

  # Extracts wanted data from results.
  #
  # @param r Single result from geocode service
  # @return [Hash] Data hash ready to save to database
  def extract_data(r)
    # Build basic data
    data = {
      latitude: r.lat,
      longitude: r.lng
    }

    # Extract component data
    c = r.components
    # Some general locations like "Europe" won't provide this info
    if c['_type'] != 'unknown'
      # extract all data from JSON response
      data['country'] = c['country']
      data['continent'] = c.dig('continent') || ''
      data['state'] = c.dig('state') || ''
      data['state_code'] = c.dig('state_code') || ''
      data['city'] = c.dig('suburb') || c.dig('town') || c.dig('city') ||
                     c.dig('county') || ''
    end

    # Extract regions data.
# TODO: DEAL WITH REGIONS
    # data['regions'] = []
    # r.annotations['UN_M49']['regions'].each do |region, _code|
    #   # Format to title case
    #   region = region.titleize
    #   # Add region but ignore 2 character country code and "World"
    #   data['regions'] << region if region.length > 2 && region != 'World'
    # end
    data
  end

  # Gets how many boats should be geocoded from arguments or user input
  #
  # @return Integer numnber of boats to geocode
  def input_amount
    # How many are not geocoded
    ungeocoded_count = Boat.where(is_geocoded: nil).count
    input_amount = process_arguments
    # Prompt for input if no argument given
    input_amount ||= prompt_amount_input(ungeocoded_count)

    # Input amount can't be higher than ungeocoded amount
    return input_amount if input_amount > ungeocoded_count ||
                           input_amount == 'all'

    input_amount
  end

  # Check if valid arguments of 'all' or integer are given.
  #
  # @return 'all' or number, nil if no argument
  def process_arguments
    return unless ENV['amount']

    return 'all' if ENV['amount'] == 'all'

    # Return numnber if entered
    ENV['amount'].to_i
  end

  # Prompt user input - Enter is for all
  #
  # @param ungeocoded_count Amount of boats not geocoded
  # @return Integer amount to geocode
  def prompt_amount_input(ungeocoded_count)
    STDOUT.puts "#{ungeocoded_count} boats not geocoded."
    STDOUT.puts '(Can supply argument amount=[number/all])'
    STDOUT.puts 'How many to geocode? (Enter - ALL)?'
    input = STDIN.gets.chomp

    return ungeocoded_count if input == '' || input.to_i > ungeocoded_count

    input.to_i
  end
end
