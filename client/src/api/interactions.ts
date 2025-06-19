import api from '../config/api';
import { Interaction, InteractionStatus } from '../types/api';
import { AxiosResponse } from 'axios';

// インタラクション作成API
export const createInteraction = async (): Promise<Interaction> => {
  const response: AxiosResponse<{ interaction: Interaction }> = await api.post('/interactions');
  return response.data.interaction;
};

// インタラクション取得API
export const getInteraction = async (code: string): Promise<Interaction> => {
  const response: AxiosResponse<{ interaction: Interaction }> = await api.get(`/interactions/${code}`);
  return response.data.interaction;
};

// カウンター取得API
export const getCounter = async (code: string): Promise<number> => {
  const response: AxiosResponse<{ counter: number }> = await api.get(`/interactions/${code}/counter`);
  return response.data.counter;
};

// カウンター更新API
export const updateCounter = async (code: string, counter: number): Promise<number> => {
  const response: AxiosResponse<{ counter: number }> = await api.patch(`/interactions/${code}/counter`, {
    counter
  });
  return response.data.counter;
};

// ステータス更新API
export const updateStatus = async (code: string, status: InteractionStatus): Promise<InteractionStatus> => {
  const response: AxiosResponse<{ status: InteractionStatus }> = await api.patch(`/interactions/${code}/state`, {
    status
  });
  return response.data.status;
};