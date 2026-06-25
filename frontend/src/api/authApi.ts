import axiosClient from './axiosClient';
import type { LoginResponse } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    axiosClient.post<LoginResponse>('/auth/login', { email, password }),

  signup: (data: {
    name: string;
    email: string;
    password: string;
    address: string;
    role?: 'NORMAL_USER' | 'STORE_OWNER';
    storeName?: string;
    storeEmail?: string;
    storeAddress?: string;
  }) => axiosClient.post<LoginResponse>('/auth/signup', data),

  changePassword: (currentPassword: string, newPassword: string) =>
    axiosClient.patch('/auth/change-password', {
      currentPassword,
      newPassword,
    }),
};
