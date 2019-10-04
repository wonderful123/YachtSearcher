class SitesController < ApplicationController
  before_action :set_site, only: [:show, :update, :destroy]

  def update_scrape
    @site = Site.find(params[:site_id])
    url = 'https://yachthub.com/list/search.html?page=1&order_by=added_desc&se_region=all&action=adv_search&new=used&cate=Sail&&price_from=1&price_to=100000000'
    UpdateScrapeJob.perform_async @site, { page_depth: 0, starting_page: 1, start_url: url }
  end

  def index
    @sites = Site.all

    render json: @sites
  end

  # GET /sites/1
  def show
    render json: @site
  end

  # POST /sites
  def create
    @site = Site.new(site_params)

    if @site.save
      render json: @site, status: :created, location: @site
    else
      render json: @site.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /sites/1
  def update
    if @site.update(site_params)
      render json: @site
    else
      render json: @site.errors, status: :unprocessable_entity
    end
  end

  # DELETE /sites/1
  def destroy
    @site.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_site
      @site = Site.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def site_params
      params.require(:site).permit(:name, :url)
    end
end
