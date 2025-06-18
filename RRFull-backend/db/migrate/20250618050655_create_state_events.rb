class CreateStateEvents < ActiveRecord::Migration[7.2]
  def change
    create_table :state_events do |t|
      t.references :interaction, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :status
      t.integer :counter

      t.timestamps
    end
  end
end
