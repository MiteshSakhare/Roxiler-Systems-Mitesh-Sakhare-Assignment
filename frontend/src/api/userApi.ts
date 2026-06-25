import axiosClient from './axiosClient';
import type { User, UserDetail, DashboardStats } from '../types';

export const userApi = {
  getAdminDashboard: () =>
    axiosClient.get<DashboardStats>('/admin/dashboard'),

  getUsers: (params?: Record<string, string>) =>
    axiosClient.get<User[]>('/admin/users', { params }),

  getUserDetail: (id: number) =>
    axiosClient.get<UserDetail>(`/admin/users/${id}`),

  createUser: (data: {
    name: string;
    email: string;
    password: string;
    address: string;
    role: string;
  }) => axiosClient.post('/admin/users', data),
};
