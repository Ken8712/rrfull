import { InteractionStatus, TimerMessage } from './api';

// Timer コンポーネントの型定義
export interface TimerProps {
  onTimerUpdate: (data: Omit<TimerMessage, 'type' | 'user_id'>) => void;
  remoteTimerState?: Omit<TimerMessage, 'type' | 'user_id'> | null;
}

// Counter コンポーネントの型定義
export interface CounterProps {
  value: number;
  onCounterUpdate: (newValue: number) => void;
  remoteValue?: number;
}

// StatusIndicator コンポーネントの型定義
export interface StatusIndicatorProps {
  currentStatus: InteractionStatus;
  onStatusUpdate: (newStatus: InteractionStatus) => void;
  remoteStatus?: InteractionStatus;
}

// StatusOption の型定義
export interface StatusOption {
  id: InteractionStatus;
  emoji: string;
  label: string;
}

// Route パラメータの型定義
export interface InteractionRoomParams {
  code: string;
}