import { createConsumer } from '@rails/actioncable';
import { API_BASE_URL } from './api';

// WebSocket接続の作成
const createCableConsumer = () => {
  const token = localStorage.getItem('token');
  const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/cable${token ? `?token=${token}` : ''}`;
  
  return createConsumer(wsUrl);
};

export default createCableConsumer;