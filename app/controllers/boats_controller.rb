require 'pagy/extras/metadata'

# Boat controller
class BoatsController < ApplicationController
  before_action :set_boat, only: [:show, :update, :destroy]
  after_action { pagy_headers_merge(@pagy) if @pagy }

  has_scope :search, :sortby

  def apply_filters(params)
    filtered = Boat.all.includes(:listings)
    filtered = filtered.filter_range('length_inches', params[:length]) unless params[:length].blank?
    filtered = filtered.filter_range('price', params[:price]) unless params[:price].blank?
    filtered = filtered.filter_range('year', params[:year]) unless params[:year].blank?
    # Combine sort column and direction into one for easier scoping
    if params[:sortby] && params[:sort_dir]
      params[:sortby] += "_#{params[:sort_dir].downcase}"
    end

    apply_scopes(filtered)
  end

  def images
    images = Listing.where(boat_id: params[:boat_id]).first
    render json: ImagesSerializer.new(images).serialized_json
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
    pp params[:thumbnails]

    options = {
      meta: pagy_metadata(@pagy),
      params: { thumbnails: params[:thumbnails] } # Send to serializer
    }

    render json: SimpleBoatSerializer.new(@boats, options).serialized_json
  end
  # options = { include: [:listings, :'listings.url', :'listings.images'] }
  # render json: SimpleBoatSerializer.new(@boats, options).serialized_json

  #
  # render json: BoatSerializer.new(
  #   @boats,
  #   {
  #     fields: {
  #       boat: [:price, :thumbnail, :length_inches, :year, :title]
  #     }
  #   }
  # ).serialized_json

  # GET /boats/1
  def show
    render json: BoatSerializer.new(@boat).serialized_json
  end

  # POST /boats
  def create
    @boat = Boat.new(boat_params)

    if @boat.save
      render json: @boat, status: :created, location: @boat
    else
      render json: @boat.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /boats/1
  def update
    if @boat.update(boat_params)
      render json: @boat
    else
      render json: @boat.errors, status: :unprocessable_entity
    end
  end

  # DELETE /boats/1
  def destroy
    @boat.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_boat
    @boat = Boat.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def boat_params
    params.require(:boat).permit(
      :length, :year, :title, :description, :make, :model, :cabins, :heads,
      :location, :country, :city, :state, :state_code, :hull_material, :price,
      :sale_status, :boat_name, :first_found, :type, :price_symbol,
      :price_formatted, :first_found
    )
  end
end
