class InteractionChannel < ApplicationCable::Channel
  def subscribed
    # インタラクションIDを取得
    interaction = Interaction.find_by(code: params[:interaction_code])
    
    if interaction
      # チャンネルにサブスクライブ
      stream_from "interaction_#{interaction.id}"
      
      # 接続成功を通知
      transmit({
        type: 'connected',
        message: 'インタラクションチャンネルに接続しました'
      })
    else
      reject
    end
  end

  def unsubscribed
    # クリーンアップ処理
    stop_all_streams
  end
  
  # クライアントからのメッセージを受信
  def receive(data)
    interaction = Interaction.find_by(code: params[:interaction_code])
    return unless interaction
    
    case data['action']
    when 'update_counter'
      handle_counter_update(interaction, data)
    when 'update_status'
      handle_status_update(interaction, data)
    when 'sync_timer'
      handle_timer_sync(interaction, data)
    end
  end
  
  private
  
  def handle_counter_update(interaction, data)
    # カウンター更新をブロードキャスト
    ActionCable.server.broadcast(
      "interaction_#{interaction.id}",
      {
        type: 'counter',
        user_id: current_user.id,
        counter: data['counter']
      }
    )
  end
  
  def handle_status_update(interaction, data)
    # ステータス更新をブロードキャスト
    ActionCable.server.broadcast(
      "interaction_#{interaction.id}",
      {
        type: 'status',
        user_id: current_user.id,
        status: data['status']
      }
    )
  end
  
  def handle_timer_sync(interaction, data)
    # タイマー同期をブロードキャスト
    ActionCable.server.broadcast(
      "interaction_#{interaction.id}",
      {
        type: 'timer',
        action: data['timer_action'],
        time: data['time'],
        user_id: current_user.id
      }
    )
  end
end