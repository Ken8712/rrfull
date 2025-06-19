import api from '../config/api';
import { LoginRequest, SignupRequest, AuthResponse, User } from '../types/api';
import { AxiosResponse } from 'axios';

// ログインAPI
export const login = async (email: string, password: string): Promise<{ user: User; token?: string }> => {
  const request: LoginRequest = {
    user: { email, password }
  };
  
  const response: AxiosResponse<AuthResponse> = await api.post('/login', request);
  
  // トークンはレスポンスヘッダーから取得
  const token = response.headers.authorization?.split(' ')[1];
  
  return {
    user: response.data.user,
    token
  };
};

// サインアップAPI
export const signup = async (
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<AuthResponse> => {
  const request: SignupRequest = {
    user: {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation
    }
  };
  
  const response: AxiosResponse<AuthResponse> = await api.post('/signup', request);
  return response.data;
};

// ログアウトAPI
export const logout = async (): Promise<void> => {
  await api.delete('/logout');
};