class InteractionStateSerializer
  include JSONAPI::Serializer
  
  attributes :id, :status, :counter, :updated_at
  
  attribute :user do |state|
    {
      id: state.user.id,
      name: state.user.name
    }
  end
end