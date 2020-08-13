class Boat < ApplicationRecord
  has_and_belongs_to_many :regions
  has_many :listings, dependent: :destroy

  scoped_search on: [:title, :model] # using scope_search gem on to search these fields

  def self.filter_range(field, range_query)
    min, max = range_query.split('to')
    if min.blank?
      where("#{field} <= #{max}")
    elsif max.blank?
      where("#{field} >= #{min}")
    else
      where("#{field} BETWEEN #{min} AND #{max}")
    end
  end


  scope :sortby, ->(sort_option) {
    # extract the sort direction from the param value.
    direction = /desc$/.match?(sort_option) ? 'desc' : 'asc'

    case sort_option.to_s
    when /^created_at_/
      order("boats.created_at #{direction}")
    when /^price_/
      where('price is not null').order("boats.price #{direction}")
    when /^first-found_/
      order("boats.first_found #{direction}")
    when /^year_/
      order("boats.year #{direction}")
    when /^title_/
      order("boats.title #{direction}")
    when /^length-inches_/
      order("boats.length_inches #{direction}")
    else
      raise(ArgumentError, "Invalid sort option: #{sort_option.inspect}")
    end
  }
end
