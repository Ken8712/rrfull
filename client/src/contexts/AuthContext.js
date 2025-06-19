import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // トークンが存在する場合、ユーザー情報を復元
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, []);

  // ログイン処理
  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { user: { email, password } });
      const { user: userData } = response.data;
      
      // トークンはレスポンスヘッダーから取得
      const token = response.headers.authorization?.split(' ')[1];
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'ログインに失敗しました' 
      };
    }
  };

  // サインアップ処理
  const signup = async (name, email, password, passwordConfirmation) => {
    try {
      const response = await api.post('/signup', {
        user: {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation
        }
      });
      
      const { user: userData } = response.data;
      
      // サインアップ後、自動的にログイン
      const loginResult = await login(email, password);
      if (loginResult.success) {
        return { success: true };
      }
      
      return { success: true, requireLogin: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'アカウント作成に失敗しました',
        errors: error.response?.data?.errors
      };
    }
  };

  // ログアウト処理
  const logout = async () => {
    try {
      await api.delete('/logout');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = {
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