class CreateInteractions < ActiveRecord::Migration[7.2]
  def change
    create_table :interactions do |t|
      t.string :code

      t.timestamps
    end
    add_index :interactions, :code, unique: true
  end
end
