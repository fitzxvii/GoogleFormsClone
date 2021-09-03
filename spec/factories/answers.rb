FactoryBot.define do
  factory :answer do
    user { nil }
    form { nil }
    question { nil }
    option { nil }
    text_answer { "MyText" }
  end
end
