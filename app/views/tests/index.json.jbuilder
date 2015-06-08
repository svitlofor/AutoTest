json.array!(@tests) do |test|
  json.extract! test, :id, :image, :text, :answers, :right_answer, :comment, :ext_comment
  json.url test_url(test, format: :json)
end
