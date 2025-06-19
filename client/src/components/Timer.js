import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';

function Timer({ onTimerUpdate, remoteTimerState }) {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);

  // リモートからのタイマー状態更新を処理
  useEffect(() => {
    if (remoteTimerState) {
      if (remoteTimerState.action === 'start') {
        setIsRunning(true);
        setTime(remoteTimerState.time || 0);
      } else if (remoteTimerState.action === 'stop') {
        setIsRunning(false);
        setTime(remoteTimerState.time || time);
      } else if (remoteTimerState.action === 'reset') {
        setIsRunning(false);
        setTime(0);
      }
    }
  }, [remoteTimerState]);

  // タイマーの動作
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
    onTimerUpdate({ action: 'start', time });
  };

  const handleStop = () => {
    setIsRunning(false);
    onTimerUpdate({ action: 'stop', time });
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    onTimerUpdate({ action: 'reset', time: 0 });
  };

  // 時間のフォーマット
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-container">
      <h3>共有タイマー</h3>
      <div className="timer-display">
        <span className="timer-icon">⏱</span>
        <span className="timer-time">{formatTime(time)}</span>
      </div>
      <div className="timer-controls">
        {!isRunning ? (
          <button onClick={handleStart} className="timer-button start">
            開始
          </button>
        ) : (
          <button onClick={handleStop} className="timer-button stop">
            停止
          </button>
        )}
        <button onClick={handleReset} className="timer-button reset">
          リセット
        </button>
      </div>
    </div>
  );
}

export default Timer;