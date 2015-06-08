class TicketTest < ActiveRecord::Base
  belongs_to :ticket
  belongs_to :test
end
