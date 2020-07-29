require 'pagy/extras/metadata'

# Boat controller
class MapsController < ApplicationController
  before_action :set_boat, only: [:show, :update, :destroy]
  after_action { pagy_headers_merge(@pagy) if @pagy }

  has_scope :search, :sortby

  def apply_filters(params)
    filtered = Boat.where(is_geocoded: true)
    filtered = filtered.filter_range('length_inches', params[:length]) unless params[:length].blank?
    filtered = filtered.filter_range('price', params[:price]) unless params[:price].blank?
    filtered = filtered.filter_range('year', params[:year]) unless params[:year].blank?
    # Combine sort column and direction into one for easier scoping
    if params[:sortby] && params[:sort_dir]
      params[:sortby] += "_#{params[:sort_dir].downcase}"
    end

    apply_scopes(filtered)
  end

  # GET /boats
  def index
    # Apply filtering from params
    @filtered = apply_filters(params)

    @pagy, @boats = pagy(
      @filtered,
      page: params[:page],
      items: params[:per_page]
    )

    options = {
      meta: pagy_metadata(@pagy),
      params: { thumbnails: params[:thumbnails] } # Send to serializer
    }

    render json: MapSerializer.new(@boats, options).serialized_json
  end

  # GET /boats/1
  def show
    render json: BoatSerializer.new(@boat).serialized_json
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_boat
    @boat = Boat.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def boat_params
    params.require(:boat).permit(
      :length, :year, :title, :make, :model, :location, :city, :state, :price,
      :sale_status, :price_symbol, :price_formatted, :latitude, :longitude, :is_geocoded
    )
  end
end
