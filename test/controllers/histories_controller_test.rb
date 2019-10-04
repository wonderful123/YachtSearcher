require 'test_helper'

class HistoriesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @history = histories(:one)
  end

  test "should get index" do
    get histories_url, as: :json
    assert_response :success
  end

  test "should create history" do
    assert_difference('History.count') do
      post histories_url, params: { history: { change_date: @history.change_date, listing_id: @history.listing_id, price: @history.price, sale_status: @history.sale_status } }, as: :json
    end

    assert_response 201
  end

  test "should show history" do
    get history_url(@history), as: :json
    assert_response :success
  end

  test "should update history" do
    patch history_url(@history), params: { history: { change_date: @history.change_date, listing_id: @history.listing_id, price: @history.price, sale_status: @history.sale_status } }, as: :json
    assert_response 200
  end

  test "should destroy history" do
    assert_difference('History.count', -1) do
      delete history_url(@history), as: :json
    end

    assert_response 204
  end
end
