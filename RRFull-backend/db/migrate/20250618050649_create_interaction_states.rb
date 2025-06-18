class CreateInteractionStates < ActiveRecord::Migration[7.2]
  def change
    create_table :interaction_states do |t|
      t.references :interaction, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :status
      t.integer :counter, default: 0

      t.timestamps
    end
  end
end
