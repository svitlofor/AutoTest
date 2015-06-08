class CreateTopics < ActiveRecord::Migration
  def change
    create_table :topics do |t|
      t.integer :number
      t.text :text

      t.timestamps null: false
    end
  end
end
