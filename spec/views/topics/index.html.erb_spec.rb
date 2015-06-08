require 'rails_helper'

RSpec.describe "topics/index", type: :view do
  before(:each) do
    assign(:topics, [
      Topic.create!(
        :number => 1,
        :text => "MyText"
      ),
      Topic.create!(
        :number => 1,
        :text => "MyText"
      )
    ])
  end

  it "renders a list of topics" do
    render
    assert_select "tr>td", :text => 1.to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
  end
end
