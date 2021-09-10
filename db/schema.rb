# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_09_09_123945) do

  create_table "answers", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "form_id", null: false
    t.bigint "question_id", null: false
    t.bigint "option_id", null: false
    t.text "text_answer"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["form_id"], name: "index_answers_on_form_id"
    t.index ["option_id"], name: "index_answers_on_option_id"
    t.index ["question_id"], name: "index_answers_on_question_id"
    t.index ["user_id"], name: "index_answers_on_user_id"
  end

  create_table "forms", charset: "utf8mb4", force: :cascade do |t|
    t.string "code"
    t.integer "form_type"
    t.string "title"
    t.text "description"
    t.text "question_order"
    t.integer "status"
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["code"], name: "form_code_index", unique: true
    t.index ["user_id"], name: "index_forms_on_user_id"
  end

  create_table "options", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "question_id", null: false
    t.string "content"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["question_id"], name: "index_options_on_question_id"
  end

  create_table "questions", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "form_id", null: false
    t.integer "question_type"
    t.string "content"
    t.text "correct_option_ids"
    t.integer "score"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["form_id"], name: "index_questions_on_form_id"
  end

  create_table "users", charset: "utf8mb4", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "password"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "email_index", unique: true
  end

  add_foreign_key "answers", "forms"
  add_foreign_key "answers", "options"
  add_foreign_key "answers", "questions"
  add_foreign_key "answers", "users"
  add_foreign_key "forms", "users"
  add_foreign_key "options", "questions"
  add_foreign_key "questions", "forms"
end
