# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_10_29_235006) do

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.integer "record_id", null: false
    t.integer "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "boats", force: :cascade do |t|
    t.float "length_inches"
    t.decimal "year"
    t.string "title"
    t.text "description"
    t.string "make"
    t.string "model"
    t.decimal "cabins"
    t.decimal "heads"
    t.string "location"
    t.string "country"
    t.string "city"
    t.string "state"
    t.string "state_code"
    t.string "hull_material"
    t.float "price"
    t.string "sale_status"
    t.string "boat_name"
    t.date "first_found"
    t.string "type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.float "latitude"
    t.float "longitude"
    t.string "continent"
    t.string "length_imperial"
    t.float "length_meters"
    t.string "price_code"
    t.string "price_symbol"
    t.string "price_formatted"
    t.string "price_name"
    t.text "full_description"
    t.string "thumbnail"
  end

  create_table "boats_regions", id: false, force: :cascade do |t|
    t.integer "boat_id", null: false
    t.integer "region_id", null: false
  end

  create_table "histories", force: :cascade do |t|
    t.float "price"
    t.string "sale_status"
    t.date "change_date"
    t.integer "listing_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "change_type"
    t.index ["listing_id"], name: "index_histories_on_listing_id"
  end

  create_table "listings", force: :cascade do |t|
    t.float "price"
    t.string "sale_status"
    t.text "description"
    t.string "title"
    t.date "first_found"
    t.string "url"
    t.integer "boat_id", null: false
    t.integer "site_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "uniq_id"
    t.text "full_description"
    t.string "price_code"
    t.string "price_symbol"
    t.string "price_formatted"
    t.string "price_name"
    t.string "thumbnail"
    t.text "images", default: "--- []\n"
    t.index ["boat_id"], name: "index_listings_on_boat_id"
    t.index ["site_id"], name: "index_listings_on_site_id"
  end

  create_table "regions", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "sites", force: :cascade do |t|
    t.string "name"
    t.string "url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "histories", "listings"
  add_foreign_key "listings", "boats"
  add_foreign_key "listings", "sites"
end
