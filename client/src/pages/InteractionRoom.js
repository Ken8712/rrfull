import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Timer from '../components/Timer';
import Counter from '../components/Counter';
import StatusIndicator from '../components/StatusIndicator';
import api from '../config/api';
import createCableConsumer from '../config/cable';
import './InteractionRoom.css';

function InteractionRoom() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [interaction, setInteraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  
  // リモート状態
  const [remoteTimerState, setRemoteTimerState] = useState(null);
  const [remoteCounter, setRemoteCounter] = useState(0);
  const [remoteStatus, setRemoteStatus] = useState('neutral');
  
  // WebSocket関連
  const cableRef = useRef(null);
  const subscriptionRef = useRef(null);

  // インタラクション情報を取得
  useEffect(() => {
    const fetchInteraction = async () => {
      try {
        const response = await api.get(`/interactions/${code}`);
        setInteraction(response.data.interaction);
        
        // 初期状態を設定
        const currentUserState = response.data.interaction.current_user_state;
        if (currentUserState) {
          setRemoteCounter(currentUserState.counter);
          setRemoteStatus(currentUserState.status);
        }
        
        setLoading(false);
      } catch (error) {
        setError('セッションの読み込みに失敗しました');
        setLoading(false);
      }
    };

    fetchInteraction();
  }, [code]);

  // WebSocket接続を確立
  useEffect(() => {
    if (!interaction) return;

    // Action Cableの接続を作成
    cableRef.current = createCableConsumer();
    
    // チャンネルに接続
    subscriptionRef.current = cableRef.current.subscriptions.create(
      { channel: 'InteractionChannel', interaction_code: code },
      {
        connected() {
          console.log('WebSocket接続成功');
          setConnected(true);
        },
        
        disconnected() {
          console.log('WebSocket接続終了');
          setConnected(false);
        },
        
        received(data) {
          console.log('受信データ:', data);
          
          // 自分自身の更新は無視
          if (data.user_id === user.id) return;
          
          // データタイプに応じて処理
          switch (data.type) {
            case 'timer':
              setRemoteTimerState({
                action: data.action,
                time: data.time
              });
              break;
              
            case 'counter':
              setRemoteCounter(data.counter);
              break;
              
            case 'status':
              setRemoteStatus(data.status);
              break;
              
            default:
              break;
          }
        }
      }
    );

    // クリーンアップ
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      if (cableRef.current) {
        cableRef.current.disconnect();
      }
    };
  }, [interaction, code, user.id]);

  // タイマー更新を送信
  const handleTimerUpdate = (timerData) => {
    if (subscriptionRef.current) {
      subscriptionRef.current.send({
        action: 'sync_timer',
        timer_action: timerData.action,
        time: timerData.time
      });
    }
  };

  // カウンター更新を送信
  const handleCounterUpdate = async (newValue) => {
    try {
      await api.patch(`/interactions/${code}/counter`, { counter: newValue });
    } catch (error) {
      console.error('カウンター更新エラー:', error);
    }
  };

  // ステータス更新を送信
  const handleStatusUpdate = async (newStatus) => {
    try {
      await api.patch(`/interactions/${code}/state`, { status: newStatus });
    } catch (error) {
      console.error('ステータス更新エラー:', error);
    }
  };

  // セッションを離れる
  const handleLeaveSession = () => {
    if (window.confirm('セッションを離れますか？')) {
      navigate('/');
    }
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/')}>戻る</button>
      </div>
    );
  }

  return (
    <div className="room-container">
      <div className="room-header">
        <div className="room-info">
          <h1>セッション: {code}</h1>
          <div className="connection-status">
            <span className={`status-dot ${connected ? 'connected' : 'disconnected'}`}></span>
            {connected ? '接続中' : '接続待機中'}
          </div>
        </div>
        <button onClick={handleLeaveSession} className="leave-button">
          セッションを離れる
        </button>
      </div>

      <div className="room-participants">
        <h3>参加者</h3>
        <div className="participants-list">
          {interaction?.users?.map(participant => (
            <div key={participant.id} className="participant">
              <span className="participant-icon">👤</span>
              <span className="participant-name">
                {participant.name}
                {participant.id === user.id && ' (あなた)'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="room-content">
        <div className="components-grid">
          <Timer 
            onTimerUpdate={handleTimerUpdate}
            remoteTimerState={remoteTimerState}
          />
          
          <StatusIndicator
            currentStatus={interaction?.current_user_state?.status || 'neutral'}
            onStatusUpdate={handleStatusUpdate}
            remoteStatus={remoteStatus}
          />
          
          <Counter
            value={interaction?.current_user_state?.counter || 0}
            onCounterUpdate={handleCounterUpdate}
            remoteValue={remoteCounter}
          />
        </div>
      </div>
    </div>
  );
}

export default InteractionRoom;