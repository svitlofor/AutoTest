class CreateTests < ActiveRecord::Migration
  def change
    create_table :tests do |t|
      t.string :image
      t.text :text
      t.text :answers
      t.integer :right_answer
      t.text :comment
      t.text :ext_comment

      t.timestamps null: false
    end
  end
end
