import React, { useState, useEffect } from 'react';
import { CounterProps } from '../types/components';
import './Counter.css';

const Counter: React.FC<CounterProps> = ({ value, onCounterUpdate, remoteValue }) => {
  const [count, setCount] = useState(value || 0);
  const [isAnimating, setIsAnimating] = useState(false);

  // リモートからのカウンター更新を処理
  useEffect(() => {
    if (remoteValue !== undefined && remoteValue !== count) {
      setCount(remoteValue);
      // アニメーションを起動
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [remoteValue, count]);

  const handleIncrement = (): void => {
    const newCount = count + 1;
    setCount(newCount);
    onCounterUpdate(newCount);
    
    // アニメーション
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="counter-container">
      <h3>共感カウンター</h3>
      <div className="counter-display">
        <button 
          onClick={handleIncrement} 
          className={`heart-button ${isAnimating ? 'animate' : ''}`}
        >
          ❤️
        </button>
        <span className="counter-value">{count}</span>
      </div>
      <p className="counter-description">
        ハートをタップして共感を共有
      </p>
    </div>
  );
};

export default Counter;