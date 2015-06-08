class CreateTopicTests < ActiveRecord::Migration
  def change
    create_table :topic_tests do |t|
      t.references :topic, index: true, foreign_key: true
      t.references :test, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
