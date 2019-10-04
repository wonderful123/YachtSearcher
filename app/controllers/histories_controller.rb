class HistoriesController < ApplicationController
  before_action :set_history, only: [:show, :update, :destroy]

  def index
    # GET /listing/1/histories
    if params[:listing_id]
      @histories = History.where(listing_id: params[:listing_id])
    # GET /histories
    else
      @histories = History.all
    end

    render json: @histories
  end

  # GET /histories/1
  def show
    render json: @history
  end

  # POST /histories
  def create
    @history = History.new(history_params)

    if @history.save
      render json: @history, status: :created, location: @history
    else
      render json: @history.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /histories/1
  def update
    if @history.update(history_params)
      render json: @history
    else
      render json: @history.errors, status: :unprocessable_entity
    end
  end

  # DELETE /histories/1
  def destroy
    @history.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_history
      @history = History.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def history_params
      params.require(:history).permit(:price, :sale_status, :change_date, :listing_id)
    end
end
