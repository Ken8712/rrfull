// ユーザー関連の型定義
export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

// 認証関連の型定義
export interface LoginRequest {
  user: {
    email: string;
    password: string;
  };
}

export interface SignupRequest {
  user: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  };
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface ErrorResponse {
  message?: string;
  error?: string;
  errors?: string[];
}

// インタラクション関連の型定義
export interface Interaction {
  id: number;
  code: string;
  created_at: string;
  users: InteractionUser[];
  current_user_state?: InteractionState;
}

export interface InteractionUser {
  id: number;
  name: string;
  state?: {
    status: string;
    counter: number;
  };
}

export interface InteractionState {
  status: InteractionStatus;
  counter: number;
}

export type InteractionStatus = 'happy' | 'thinking' | 'stressed' | 'neutral';

// WebSocket メッセージの型定義
export type WebSocketMessage = 
  | UserJoinedMessage
  | TimerMessage
  | CounterMessage
  | StatusMessage
  | NavigationMessage;

export interface UserJoinedMessage {
  type: 'user_joined';
  user_id: number;
  user_name: string;
}

export interface TimerMessage {
  type: 'timer';
  action: 'start' | 'stop' | 'reset';
  time: number;
  user_id: number;
}

export interface CounterMessage {
  type: 'counter';
  counter: number;
  user_id: number;
}

export interface StatusMessage {
  type: 'status';
  status: InteractionStatus;
  user_id: number;
}

export interface NavigationMessage {
  type: 'navigation';
  screen: string;
  user_id: number;
}