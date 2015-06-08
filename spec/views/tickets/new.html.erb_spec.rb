require 'rails_helper'

RSpec.describe "tickets/new", type: :view do
  before(:each) do
    assign(:ticket, Ticket.new(
      :number => 1,
      :category => nil
    ))
  end

  it "renders new ticket form" do
    render

    assert_select "form[action=?][method=?]", tickets_path, "post" do

      assert_select "input#ticket_number[name=?]", "ticket[number]"

      assert_select "input#ticket_category_id[name=?]", "ticket[category_id]"
    end
  end
end
