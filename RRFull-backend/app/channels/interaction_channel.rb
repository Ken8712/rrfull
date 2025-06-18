class InteractionChannel < ApplicationCable::Channel
  # チャンネルに接続時
  def subscribed
    interaction = Interaction.find_by(code: params[:interaction_code])
    
    if interaction
      stream_from "interaction_#{interaction.id}"
      
      # 接続通知を送信
      ActionCable.server.broadcast(
        "interaction_#{interaction.id}",
        {
          type: 'user_joined',
          user_id: current_user.id,
          user_name: current_user.name
        }
      )
    else
      reject
    end
  end

  # チャンネルから切断時
  def unsubscribed
    # 必要に応じて切断通知を送信
  end
  
  # タイマーの同期
  def sync_timer(data)
    interaction = Interaction.find_by(code: params[:interaction_code])
    
    if interaction
      ActionCable.server.broadcast(
        "interaction_#{interaction.id}",
        {
          type: 'timer',
          action: data['action'],
          time: data['time'],
          user_id: current_user.id
        }
      )
    end
  end
  
  # 画面遷移の同期
  def sync_navigation(data)
    interaction = Interaction.find_by(code: params[:interaction_code])
    
    if interaction
      ActionCable.server.broadcast(
        "interaction_#{interaction.id}",
        {
          type: 'navigation',
          screen: data['screen'],
          user_id: current_user.id
        }
      )
    end
  end
end