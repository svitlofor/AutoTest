json.array!(@topics) do |topic|
  json.extract! topic, :id, :number, :text
  json.url topic_url(topic, format: :json)
end
