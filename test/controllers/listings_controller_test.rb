require 'test_helper'

class ListingsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @listing = listings(:one)
  end

  test "should get index" do
    get listings_url, as: :json
    assert_response :success
  end

  test "should create listing" do
    assert_difference('Listing.count') do
      post listings_url, params: { listing: { boat_id: @listing.boat_id, description: @listing.description, first_found: @listing.first_found, price: @listing.price, sale_status: @listing.sale_status, site_id: @listing.site_id, title: @listing.title, url: @listing.url } }, as: :json
    end

    assert_response 201
  end

  test "should show listing" do
    get listing_url(@listing), as: :json
    assert_response :success
  end

  test "should update listing" do
    patch listing_url(@listing), params: { listing: { boat_id: @listing.boat_id, description: @listing.description, first_found: @listing.first_found, price: @listing.price, sale_status: @listing.sale_status, site_id: @listing.site_id, title: @listing.title, url: @listing.url } }, as: :json
    assert_response 200
  end

  test "should destroy listing" do
    assert_difference('Listing.count', -1) do
      delete listing_url(@listing), as: :json
    end

    assert_response 204
  end
end
