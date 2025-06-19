import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createInteraction, getInteraction } from '../api/interactions';
import './InteractionEntry.css';

const InteractionEntry: React.FC = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 新しいインタラクションを作成
  const handleCreateInteraction = async (): Promise<void> => {
    setLoading(true);
    setError('');
    
    try {
      const interaction = await createInteraction();
      navigate(`/interaction/${interaction.code}`);
    } catch (error) {
      setError('セッションの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 既存のインタラクションに参加
  const handleJoinInteraction = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (code.length !== 6) {
      setError('セッションコードは6文字で入力してください');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // セッション情報を取得して参加
      await getInteraction(code);
      navigate(`/interaction/${code}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setError('セッションが見つかりません');
      } else {
        setError('参加に失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="entry-container">
      <div className="entry-header">
        <h1>RRFull</h1>
        <div className="user-info">
          <span>こんにちは、{user?.name}さん</span>
          <button onClick={logout} className="logout-button">
            ログアウト
          </button>
        </div>
      </div>

      <div className="entry-content">
        <div className="entry-card">
          <h2>新しいセッションを開始</h2>
          <p>2人でリアルタイムコミュニケーションを始めましょう</p>
          <button 
            onClick={handleCreateInteraction}
            disabled={loading}
            className="create-button"
          >
            セッションを作成
          </button>
        </div>

        <div className="divider">または</div>

        <div className="entry-card">
          <h2>セッションに参加</h2>
          <p>相手から共有されたコードを入力してください</p>
          <form onSubmit={handleJoinInteraction}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="6文字のコード"
              maxLength={6}
              className="code-input"
            />
            <button 
              type="submit"
              disabled={loading || code.length !== 6}
              className="join-button"
            >
              参加する
            </button>
          </form>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default InteractionEntry;