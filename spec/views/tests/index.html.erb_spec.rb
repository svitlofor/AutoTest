require 'rails_helper'

RSpec.describe "tests/index", type: :view do
  before(:each) do
    assign(:tests, [
      Test.create!(
        :image => "Image",
        :text => "MyText",
        :answers => "MyText",
        :right_answer => 1,
        :comment => "MyText",
        :ext_comment => "MyText"
      ),
      Test.create!(
        :image => "Image",
        :text => "MyText",
        :answers => "MyText",
        :right_answer => 1,
        :comment => "MyText",
        :ext_comment => "MyText"
      )
    ])
  end

  it "renders a list of tests" do
    render
    assert_select "tr>td", :text => "Image".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => 1.to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
  end
end
