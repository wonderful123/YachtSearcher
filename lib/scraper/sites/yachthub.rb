require 'open-uri'
require_relative 'listing_site'

module Scraper
  # Scrapes data from yachthub listings
  class Yachthub < ListingSite
    START_URL = 'https://yachthub.com/list/search.html?page=1&order_by=added_desc&se_region=all&action=adv_search&new=used&cate=Sail&price_from=1&price_to=100000000'

    # Function starts the scraping process
    # Returns an array of hashes which contain the boat information
    # Data of each listing returned can be seen in next function.
    def scrape
      # scrape first page and create list of index pages
      first_page = Nokogiri::HTML(open(@start_url || START_URL))
      index_pages = get_index_pages(first_page)

      # scrape the first page's boats. No need to do 2 requests
      boat_collection = scrape_boats_from_index_page(first_page)

      if @page_depth == 0 || @page_depth > @last_page_number
        @page_depth = @last_page_number # set from index scrape above
      end

      # loop through pages until page depth option
      page_number = @starting_page - 1

      until page_number >= @page_depth
        puts "Scraping page: #{page_number + 1}/#{@page_depth} - url: #{index_pages[page_number]}"
        page = Nokogiri::HTML(open(index_pages[page_number]))
        boat_collection += scrape_boats_from_index_page(page)

        page_number += 1
      end

      return boat_collection
    end

    def scrape_boats_from_index_page(index_page)
      boat_urls = scrape_index_boat_urls(index_page)
      boat_thumbnails = scrape_index_thumbnails(index_page)
      boat_prices = scrape_index_prices(index_page)
      boat_years = scrape_index_years(index_page)
      boat_lengths = scrape_index_lengths(index_page)
      boat_locations = scrape_index_locations(index_page)
      boat_titles = scrape_index_titles(index_page)
      boat_descriptions = scrape_index_descriptions(index_page)
      boat_sale_status = scrape_index_sale_status(index_page)

      # combine all the data
      boats = []
      boat_urls.each_with_index do |url, i|
        if i != 0 # skip first element because it's an ad
          boats << {
            :url => url,
            :uniq_id => "yachthub-" + url.match(/\d*$/).to_s, # use unique digits from url to create listing id
            :thumbnail => boat_thumbnails[i],
            :price => boat_prices[i],
            :year => boat_years[i],
            :length => boat_lengths[i],
            :location => boat_locations[i],
            :title => boat_titles[i],
            :description => boat_descriptions[i],
            :sale_status => boat_sale_status[i],
          }
        end
      end

      return boats
    end

    def scrape_index_boat_urls(index_page)
      url_tags = index_page.xpath('//a[contains(text(), "View Listing")]')
      urls = url_tags.map { |tag| 'https://yachthub.com' + tag['href'] }
    end

    def scrape_index_thumbnails(index_page)
      image_list = index_page.css("span.thumb-info-wrapper img")
      image_list.map { |tag| tag.attr('src') }
    end

    def scrape_index_prices(index_page)
      price_tags = index_page.css("span.bw_List_Price")
      # return the price only, strip other characters
      price_tags.map { |tag| tag.text.gsub(/[^0-9]/, '') }
    end

    def scrape_index_years(index_page)
      year_tags = index_page.css("div.bw_List_Year")
      # return the year only, strip other characters
      year_tags.map { |tag| tag.text.gsub(/[^0-9]/, '') }
    end

    def scrape_index_lengths(index_page)
      length_tags = index_page.css("div.bw_List_Length")

      length_tags.map do |tag|
        length = tag.text
        length = length.match(/^(.*?)\s+-/).to_s
        feet = length.match(/^(.*?)'/).to_s.to_i
        inches = length.match(/\s\d+\"/).to_s.to_i
        total_inches = feet * 12 + inches
        total_inches.to_i
      end
    end

    def scrape_index_locations(index_page)
      location_tags = index_page.css("div.bw_List_Location")
      location_tags.map { |tag| tag.text.lstrip }
    end

    def scrape_index_titles(index_page)
      title_tags = index_page.css("div.List_MakeModel a")
      title_tags.map { |tag| tag.text.lstrip }
    end

    def scrape_index_descriptions(index_page)
      description_tags = index_page.css("div.bw_List_Text")
      description_tags.map { |tag| tag.text.lstrip }
    end

    def scrape_index_sale_status(index_page)
      # Optionally contained in image containers
      image_container_tags = index_page.css("div.bw_List_Image_Container")
      image_container_tags.map {|tag| tag.css("span.text-overlay").text }
    end

    def get_index_pages(first_page)
      last_page_link = first_page.css("ul.pagination li a").last['href']
      @last_page_number = last_page_link.match(/(?<=page=)\d+/).to_s.to_i

      pages = []
      (1..@last_page_number).each { |n| pages << START_URL.gsub('page=1', "page=#{n}") }

      return pages
    end
  end
end


  # def extract_boat_listing_info(link)
  #   html = Nokogiri::HTML(open('https://yachthub.com' + link))
  #
  #   boat_data = {}
  #
  #   # Make & Model
  #   breadcrumb_link = html.css("div[id*=breadcrumb] h2 a").last['href']
  #   boat_data[:builder] = breadcrumb_link.match(/(?<=Make_Model=)[^&]*/).to_s.gsub('+',' ').split(" ").map {|word| word.capitalize}.join(" ")
  #   boat_data[:model] = breadcrumb_link.match(/(?<=keywords=).*/).to_s.gsub '+', ' '
  #
  #   # Price
  #   price = html.css("div.Yacht_Price div.Field")
  #   price = price.first.text.match(/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?/)
  #   boat_data[:price] = price.to_s.gsub(/\D/,'').to_i
  #
  #   # Length
  #   length = html.css("div.Yacht_Length div.Field").text
  #   length = length.match(/^(.*?)\s+-/).to_s
  #   feet = length.match(/^(.*?)'/).to_s.to_i
  #   inches = length.match(/\s\d+\"/).to_s.to_i
  #   boat_data[:total_inches] = feet * 12 + inches
  #
  #   # Year
  #   boat_data[:year] = html.css("div.Yacht_Year div.Field").first.text
  #
  #   # Unique ID (created from yachthub number in link)
  #   boat_data[:] = "yachthub-" + link.match(/\d*$/).to_s
  #
  #   return boat_data
  # end
  #
  # def create_boat(boat_data)
  #   boat_data = Boat.new(:year => year, :builder => builder, :model => model, :price => price, : => )
  #   boat = Boat.find_by :
  #   puts "Boat already in database: " + boat.inspect
  #   puts "*" * 30
  # end
