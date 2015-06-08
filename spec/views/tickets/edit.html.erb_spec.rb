require 'rails_helper'

RSpec.describe "tickets/edit", type: :view do
  before(:each) do
    @ticket = assign(:ticket, Ticket.create!(
      :number => 1,
      :category => nil
    ))
  end

  it "renders the edit ticket form" do
    render

    assert_select "form[action=?][method=?]", ticket_path(@ticket), "post" do

      assert_select "input#ticket_number[name=?]", "ticket[number]"

      assert_select "input#ticket_category_id[name=?]", "ticket[category_id]"
    end
  end
end
