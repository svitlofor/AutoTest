require 'rails_helper'

RSpec.describe "topics/new", type: :view do
  before(:each) do
    assign(:topic, Topic.new(
      :number => 1,
      :text => "MyText"
    ))
  end

  it "renders new topic form" do
    render

    assert_select "form[action=?][method=?]", topics_path, "post" do

      assert_select "input#topic_number[name=?]", "topic[number]"

      assert_select "textarea#topic_text[name=?]", "topic[text]"
    end
  end
end
