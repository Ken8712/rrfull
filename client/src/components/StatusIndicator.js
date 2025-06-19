import React, { useState, useEffect } from 'react';
import './StatusIndicator.css';

const STATUSES = [
  { id: 'happy', emoji: '😊', label: 'ハッピー' },
  { id: 'thinking', emoji: '🤔', label: '考え中' },
  { id: 'stressed', emoji: '😓', label: 'ストレス' },
  { id: 'neutral', emoji: '😐', label: 'ふつう' }
];

function StatusIndicator({ currentStatus, onStatusUpdate, remoteStatus }) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus || 'neutral');

  // リモートからのステータス更新を処理
  useEffect(() => {
    if (remoteStatus && remoteStatus !== selectedStatus) {
      setSelectedStatus(remoteStatus);
    }
  }, [remoteStatus]);

  const handleStatusSelect = (statusId) => {
    setSelectedStatus(statusId);
    onStatusUpdate(statusId);
  };

  const getCurrentEmoji = () => {
    const status = STATUSES.find(s => s.id === selectedStatus);
    return status ? status.emoji : '😐';
  };

  return (
    <div className="status-container">
      <h3>心理状態を共有</h3>
      <div className="current-status">
        <span className="current-emoji">{getCurrentEmoji()}</span>
      </div>
      <div className="status-options">
        {STATUSES.map(status => (
          <button
            key={status.id}
            onClick={() => handleStatusSelect(status.id)}
            className={`status-button ${selectedStatus === status.id ? 'active' : ''}`}
            title={status.label}
          >
            <span className="status-emoji">{status.emoji}</span>
            <span className="status-label">{status.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default StatusIndicator;