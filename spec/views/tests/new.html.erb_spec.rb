require 'rails_helper'

RSpec.describe "tests/new", type: :view do
  before(:each) do
    assign(:test, Test.new(
      :image => "MyString",
      :text => "MyText",
      :answers => "MyText",
      :right_answer => 1,
      :comment => "MyText",
      :ext_comment => "MyText"
    ))
  end

  it "renders new test form" do
    render

    assert_select "form[action=?][method=?]", tests_path, "post" do

      assert_select "input#test_image[name=?]", "test[image]"

      assert_select "textarea#test_text[name=?]", "test[text]"

      assert_select "textarea#test_answers[name=?]", "test[answers]"

      assert_select "input#test_right_answer[name=?]", "test[right_answer]"

      assert_select "textarea#test_comment[name=?]", "test[comment]"

      assert_select "textarea#test_ext_comment[name=?]", "test[ext_comment]"
    end
  end
end
