require 'test_helper'

class BoatsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @boat = boats(:one)
  end

  test "should get index" do
    get boats_url, as: :json
    assert_response :success
  end

  test "should create boat" do
    assert_difference('Boat.count') do
      post boats_url, params: { boat: { boat_name: @boat.boat_name, cabins: @boat.cabins, city: @boat.city, country: @boat.country, description: @boat.description, first_found: @boat.first_found, heads: @boat.heads, hull_material: @boat.hull_material, length: @boat.length, location: @boat.location, make: @boat.make, model: @boat.model, price: @boat.price, sale_status: @boat.sale_status, state: @boat.state, state_code: @boat.state_code, title: @boat.title, type: @boat.type, year: @boat.year } }, as: :json
    end

    assert_response 201
  end

  test "should show boat" do
    get boat_url(@boat), as: :json
    assert_response :success
  end

  test "should update boat" do
    patch boat_url(@boat), params: { boat: { boat_name: @boat.boat_name, cabins: @boat.cabins, city: @boat.city, country: @boat.country, description: @boat.description, first_found: @boat.first_found, heads: @boat.heads, hull_material: @boat.hull_material, length: @boat.length, location: @boat.location, make: @boat.make, model: @boat.model, price: @boat.price, sale_status: @boat.sale_status, state: @boat.state, state_code: @boat.state_code, title: @boat.title, type: @boat.type, year: @boat.year } }, as: :json
    assert_response 200
  end

  test "should destroy boat" do
    assert_difference('Boat.count', -1) do
      delete boat_url(@boat), as: :json
    end

    assert_response 204
  end
end
