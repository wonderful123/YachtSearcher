require 'test_helper'

class ChangesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @change = changes(:one)
  end

  test "should get index" do
    get changes_url, as: :json
    assert_response :success
  end

  test "should create change" do
    assert_difference('Change.count') do
      post changes_url, params: { change: { boat_id: @change.boat_id, change_date: @change.change_date, price: @change.price, sale_status: @change.sale_status } }, as: :json
    end

    assert_response 201
  end

  test "should show change" do
    get change_url(@change), as: :json
    assert_response :success
  end

  test "should update change" do
    patch change_url(@change), params: { change: { boat_id: @change.boat_id, change_date: @change.change_date, price: @change.price, sale_status: @change.sale_status } }, as: :json
    assert_response 200
  end

  test "should destroy change" do
    assert_difference('Change.count', -1) do
      delete change_url(@change), as: :json
    end

    assert_response 204
  end
end
