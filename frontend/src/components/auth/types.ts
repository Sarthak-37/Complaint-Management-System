// Optional centralized type definitions for the auth system

export type AuthView = 'login' | 'register';

export type UserRole = 'USER' | 'AUTHORITY' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface DemoCredentials {
  role: UserRole;
  email: string;
  password: string;
  label: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}