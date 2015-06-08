require 'rails_helper'

RSpec.describe "topics/edit", type: :view do
  before(:each) do
    @topic = assign(:topic, Topic.create!(
      :number => 1,
      :text => "MyText"
    ))
  end

  it "renders the edit topic form" do
    render

    assert_select "form[action=?][method=?]", topic_path(@topic), "post" do

      assert_select "input#topic_number[name=?]", "topic[number]"

      assert_select "textarea#topic_text[name=?]", "topic[text]"
    end
  end
end
