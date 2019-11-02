class BoatsController < ApplicationController
  before_action :set_boat, only: [:show, :update, :destroy]
  after_action { pagy_headers_merge(@pagy) if @pagy }

  def stats
    render json: {
      Boats: Boat.all.count,
      Listings: Listing.all.count,
      Histories: History.all.count,
      "Sold Boats": Boat.where(sale_status: "Sold").count,
      "Under Offer": Boat.where(sale_status: "Under Offer").count,
      "Under Contract": Boat.where(sale_status: "Under Contract").count,
      "Just Listed": Boat.where(sale_status: "JUST LISTED").count,
    }
  end

  # GET /boats
  def index
    if params[:region_id]
      # GET /regions/1/boats
      @boats = Boat.where(region_id: params[:region_id])
    elsif params[:page]
      @pagy, @boats = pagy(
        Boat.all.order(price: :desc),
        page: params[:page],
        items: 10000)
    else
      @boats = Boat.all
    end

    render json: BoatSerializer.new(
      @boats,
      {
        fields: {
          boat: [:price, :thumbnail, :length_inches, :year, :title]
        }
      }
    ).serialized_json
  end


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
      params.require(:boat).permit(:length, :year, :title, :description, :make, :model, :cabins, :heads, :location, :country, :city, :state, :state_code, :hull_material, :price, :sale_status, :boat_name, :first_found, :type)
    end
end
