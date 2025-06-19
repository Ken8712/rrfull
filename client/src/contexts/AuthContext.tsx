import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types/api';
import * as authApi from '../api/auth';

// コンテキストの型定義
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

interface AuthResult {
  success: boolean;
  error?: string;
  errors?: string[];
  requireLogin?: boolean;
}

// コンテキストの作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// カスタムフック
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// プロバイダーコンポーネント
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // トークンが存在する場合、ユーザー情報を復元
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Failed to parse user data:', error);
          localStorage.removeItem('user');
        }
      }
    }
    setLoading(false);
  }, []);

  // ログイン処理
  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { user: userData, token } = await authApi.login(email, password);
      
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'ログインに失敗しました' 
      };
    }
  };

  // サインアップ処理
  const signup = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<AuthResult> => {
    try {
      await authApi.signup(name, email, password, passwordConfirmation);
      
      // サインアップ後、自動的にログイン
      const loginResult = await login(email, password);
      if (loginResult.success) {
        return { success: true };
      }
      
      return { success: true, requireLogin: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'アカウント作成に失敗しました',
        errors: error.response?.data?.errors
      };
    }
  };

  // ログアウト処理
  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};