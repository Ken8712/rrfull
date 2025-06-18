class InteractionSerializer
  include JSONAPI::Serializer
  
  attributes :id, :code, :created_at
  
  attribute :users do |interaction, params|
    interaction.users.map do |user|
      {
        id: user.id,
        name: user.name,
        state: interaction.interaction_states.find_by(user: user)&.slice(:status, :counter)
      }
    end
  end
  
  attribute :current_user_state do |interaction, params|
    if params[:current_user]
      state = interaction.interaction_states.find_by(user: params[:current_user])
      state&.slice(:status, :counter)
    end
  end
end