export enum Role {
  ADMIN = 'ADMIN',
  NORMAL_USER = 'NORMAL_USER',
  STORE_OWNER = 'STORE_OWNER',
}

export interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  role: Role;
  createdAt: string;
}

export interface UserDetail extends User {
  store?: {
    id: number;
    name: string;
    email: string;
    address: string;
    averageRating: number;
  };
}

export interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  ownerId: number;
  createdAt: string;
  averageRating: number;
}

export interface UserStore {
  id: number;
  name: string;
  address: string;
  averageRating: number;
  userRating: number | null;
}

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface StoreOwnerDashboard {
  storeName: string;
  averageRating: number;
  ratings: Array<{
    userName: string;
    userEmail: string;
    rating: number;
    createdAt: string;
  }>;
}

export interface AuthPayload {
  sub: number;
  role: Role;
  name: string;
  email: string;
  exp: number;
  iat: number;
}

export interface LoginResponse {
  accessToken: string;
}
