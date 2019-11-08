class Boat < ApplicationRecord
  has_and_belongs_to_many :regions
  has_many :listings, dependent: :destroy

  scope :search_query, ->(query) {
    return nil if query.blank?

    # condition query, parse into individual keywords
    terms = query.downcase.split(/\s+/)

    # replace "*" with "%" for wildcard searches,
    # append '%', remove duplicate '%'s
    terms = terms.map { |e|
      (e.tr("*", "%") + "%").gsub(/%+/, "%")
    }
    # configure number of OR conditions for provision
    # of interpolation arguments. Adjust this if you
    # change the number of OR conditions.
    num_or_conds = 2
    where(
      terms.map { |_term|
        "(LOWER(boats.title) LIKE ? OR LOWER(boats.year) LIKE ?)"
      }.join(" AND "),
      *terms.map { |e| [e] * num_or_conds }.flatten,
    )
  }

  scope :sorted_by, ->(sort_option, sort_dir) {
    # extract the sort direction from the param value.
    direction = /desc$/.match?(sort_option) ? "desc" : "asc"
    case sort_option.to_s
    when /^created_at_/
      order("boats.created_at #{direction}")
    when /^price_/
      where("price is not null").order("boats.price #{direction}")
    when /^year_/
      order("boats.year #{direction}")
    when /^title_/
      order("boats.title #{direction}")
    when /^length_/
      order("boats.length_inches #{direction}")
    else
      raise(ArgumentError, "Invalid sort option: #{sort_option.inspect}")
    end
  }
end
