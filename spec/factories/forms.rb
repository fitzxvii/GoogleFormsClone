FactoryBot.define do
  factory :form do
    code { "MyString" }
    form_type { 1 }
    title { "MyString" }
    description { "MyText" }
    question_order { "MyText" }
    status { 1 }
    user { nil }
  end
end
