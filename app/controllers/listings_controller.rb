class ListingsController < ApplicationController
  before_action :set_listing, only: [:show, :update, :destroy]

  def index
    # GET /boats/1/listings
    if params[:boat_id]
      @listings = Listing.where(boat_id: params[:boat_id])
    # GET /sites/1/listings
    elsif params[:site_id]
      @listings = Listing.where(site_id: params[:site_id])
    # GET /listings
    else
      @listings = Listing.all
    end

    render json: @listings
  end

  # GET /listings/1
  def show
    render json: @listing
  end

  # POST /listings
  def create
    @listing = Listing.new(listing_params)

    if @listing.save
      render json: @listing, status: :created, location: @listing
    else
      render json: @listing.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /listings/1
  def update
    if @listing.update(listing_params)
      render json: @listing
    else
      render json: @listing.errors, status: :unprocessable_entity
    end
  end

  # DELETE /listings/1
  def destroy
    @listing.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_listing
      @listing = Listing.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def listing_params
      params.require(:listing).permit(:price, :sale_status, :description, :title, :first_found, :url, :boat_id, :site_id)
    end
end
