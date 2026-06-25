import axiosClient from './axiosClient';
import type { Store, UserStore, StoreOwnerDashboard } from '../types';

export const storeApi = {
  getAdminStores: (params?: Record<string, string>) =>
    axiosClient.get<Store[]>('/admin/stores', { params }),

  createStore: (data: {
    name: string;
    email: string;
    address: string;
    ownerId: number;
  }) => axiosClient.post('/admin/stores', data),

  getUserStores: (params?: Record<string, string>) =>
    axiosClient.get<UserStore[]>('/stores', { params }),

  getStoreOwnerDashboard: () =>
    axiosClient.get<StoreOwnerDashboard>('/store-owner/dashboard'),
};
