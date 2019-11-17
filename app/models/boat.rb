class Boat < ApplicationRecord
  has_and_belongs_to_many :regions
  has_many :listings, dependent: :destroy

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

  scope :search, ->(query) {
    return nil if query.blank?

    # condition query, parse into individual keywords
    terms = query.downcase.split(/\s+/)

    # replace "*" with "%" for wildcard searches,
    # append '%', remove duplicate '%'s
    terms = terms.map do |e|
      (e.tr('*', '%') + '%').gsub(/%+/, '%')
    end
    # configure number of OR conditions for provision
    # of interpolation arguments. Adjust this if you
    # change the number of OR conditions.
    num_or_conds = 2
    where(
      terms.map do |_term|
        '(LOWER(boats.title) LIKE ? OR LOWER(boats.year) LIKE ?)'
      end.join(' AND '),
      *terms.map { |e| [e] * num_or_conds }.flatten
    )
  }

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
