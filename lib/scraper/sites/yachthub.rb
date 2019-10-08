require 'open-uri'
require_relative 'listing_site'

module Scraper
  # Scrapes data from yachthub listings
  class Yachthub < ListingSite
    DEFAULT_START_URL = 'https://yachthub.com/list/search.html?page=1&order_by=added_desc&se_region=all&action=adv_search&new=used&cate=Sail&price_from=1&price_to=100000000'

    # Gets list of index page urls. Amount depends on options given.
    def get_index_pages
      start_url = @start_url || DEFAULT_START_URL
      html = Nokogiri::HTML(open(start_url))

      # Scrape the last page number available
      last_page_link = html.css("ul.pagination li a").last['href']
      last_page_number = last_page_link.match(/(?<=page=)\d+/).to_s.to_i

      number_of_pages = @page_depth
      if @page_depth == 0 || @page_depth > last_page_number
        number_of_pages = last_page_number # set from index scrape above
      end

      pages = []
      (1..number_of_pages).each { |n| pages << start_url.gsub('page=1', "page=#{n}") }

      return pages
    end

    # Function starts the scraping process
    # Returns an array of hashes which contain the boat information
    # Data of each listing returned can be seen in next function.
    def scrape
      # scrape first page and create list of index pages
      @start_url = @start_url || DEFAULT_START_URL
      first_page = Nokogiri::HTML(open(@start_url))
      index_pages = get_index_pages_old(first_page)

      boat_collection = scrape_index_page(@start_url)

      if @page_depth == 0 || @page_depth > @last_page_number
        @page_depth = @last_page_number # set from index scrape above
      end

      # loop through pages until page depth option
      page_number = @starting_page

      until page_number >= @page_depth
        puts "Scraping index [#{page_number + 1}/#{@page_depth}] - #{index_pages[page_number]}"

        boat_collection += scrape_index_page(index_pages[page_number])

        page_number += 1
      end

      return boat_collection
    end

    def scrape_index_page(index_url)
      html = Nokogiri::HTML(open(index_url))

      boat_urls = scrape_index_boat_urls(html)
      boat_thumbnails = scrape_index_thumbnails(html)
      boat_prices = scrape_index_prices(html)
      boat_years = scrape_index_years(html)
      boat_lengths = scrape_index_lengths(html)
      boat_locations = scrape_index_locations(html)
      boat_titles = scrape_index_titles(html)
      boat_descriptions = scrape_index_descriptions(html)
      boat_sale_status = scrape_index_sale_status(html)

      # Combine all the data
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

#######################################

    def get_index_pages_old(first_page)
      last_page_link = first_page.css("ul.pagination li a").last['href']
      @last_page_number = last_page_link.match(/(?<=page=)\d+/).to_s.to_i

      pages = []
      (1..@last_page_number).each { |n| pages << @start_url.gsub('page=1', "page=#{n}") }

      return pages
    end

########################################
    def scrape_listing_page(url)
      html = Nokogiri::HTML(open(url))

      boat_data = {}

      # Make & Model
      script_meta_data = html.css("script#loopa_info").text
      meta_data = Shellwords.split(script_meta_data)

      index = meta_data.index("make:")
      boat_data[:make] = meta_data[index + 1].gsub(',', '')

      index = meta_data.index("model:")
      boat_data[:model] = meta_data[index + 1].gsub(',', '')

      # Full description
      boat_data[:description] = html.css("div.Yacht_Desc div.Field").text

      # boat_name
      boat_data[:boat_name] = html.css("div.Field.Yacht_Region_Field").first.text

      # hull
      boat_data[:hull_material] = html.css("div.Field.Yacht_HullMaterial_Field").first.text

      return boat_data
    end
  end
end
