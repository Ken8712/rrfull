class InteractionsController < AuthenticatedController
  before_action :set_interaction, only: [:show, :show_counter, :update_counter, :state]
  
  # POST /interactions
  # 新しいインタラクションを作成
  def create
    @interaction = Interaction.new
    
    if @interaction.save
      # 作成者のInteractionStateを作成
      @interaction.interaction_states.create!(
        user: current_user,
        status: 'neutral',
        counter: 0
      )
      
      render json: {
        interaction: InteractionSerializer.new(@interaction).serializable_hash[:data][:attributes]
      }, status: :created
    else
      render json: { errors: @interaction.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # GET /interactions/:id
  # インタラクションの詳細を取得
  def show
    # 現在のユーザーがまだ参加していない場合は参加させる
    unless @interaction.users.include?(current_user)
      @interaction.interaction_states.create!(
        user: current_user,
        status: 'neutral',
        counter: 0
      )
    end
    
    render json: {
      interaction: InteractionSerializer.new(
        @interaction,
        params: { current_user: current_user }
      ).serializable_hash[:data][:attributes]
    }
  end
  
  # GET /interactions/:id/counter
  # カウンターの現在値を取得
  def show_counter
    interaction_state = @interaction.interaction_states.find_by(user: current_user)
    
    render json: {
      counter: interaction_state&.counter || 0
    }
  end
  
  # PATCH /interactions/:id/counter
  # カウンターを更新
  def update_counter
    interaction_state = @interaction.interaction_states.find_or_create_by(user: current_user) do |state|
      state.status = 'neutral'
      state.counter = 0
    end
    
    if params[:counter].present?
      interaction_state.update!(counter: params[:counter])
      
      # 履歴を記録
      @interaction.state_events.create!(
        user: current_user,
        counter: params[:counter]
      )
      
      # WebSocketで他のユーザーに通知
      ActionCable.server.broadcast(
        "interaction_#{@interaction.id}",
        {
          type: 'counter',
          user_id: current_user.id,
          counter: interaction_state.counter
        }
      )
    end
    
    render json: { counter: interaction_state.counter }
  end
  
  # PATCH /interactions/:id/state
  # 心理状態を更新
  def state
    interaction_state = @interaction.interaction_states.find_or_create_by(user: current_user) do |state|
      state.status = 'neutral'
      state.counter = 0
    end
    
    if params[:status].present?
      interaction_state.update!(status: params[:status])
      
      # 履歴を記録
      @interaction.state_events.create!(
        user: current_user,
        status: params[:status]
      )
      
      # WebSocketで他のユーザーに通知
      ActionCable.server.broadcast(
        "interaction_#{@interaction.id}",
        {
          type: 'status',
          user_id: current_user.id,
          status: interaction_state.status
        }
      )
    end
    
    render json: { status: interaction_state.status }
  end
  
  private
  
  def set_interaction
    @interaction = Interaction.find_by!(code: params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'インタラクションが見つかりません' }, status: :not_found
  end
end