class InteractionSerializer
  include JSONAPI::Serializer
  
  attributes :id, :code, :created_at
  
  attribute :users do |interaction, params|
    interaction.users.map do |user|
      {
        id: user.id,
        name: user.name,
        email: user.email
      }
    end
  end
  
  attribute :states do |interaction, params|
    interaction.interaction_states.map do |state|
      {
        user_id: state.user_id,
        status: state.status,
        counter: state.counter,
        updated_at: state.updated_at
      }
    end
  end
  
  attribute :current_user_state do |interaction, params|
    if params && params[:current_user]
      state = interaction.interaction_states.find_by(user: params[:current_user])
      if state
        {
          status: state.status,
          counter: state.counter
        }
      end
    end
  end
end