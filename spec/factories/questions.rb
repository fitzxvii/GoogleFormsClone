FactoryBot.define do
  factory :question do
    form { nil }
    question_type { 1 }
    content { "MyString" }
    correct_option_id { 1 }
    score { 1 }
  end
end
