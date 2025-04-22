import axios from 'axios';
import { useApi } from './api';

// User interface
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
  firebaseUid?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// User role enum
export enum UserRole {
  ADMIN = 'admin',
  SCHOOL_ADMIN = 'school_admin',
  DRIVER = 'driver',
  PARENT = 'parent',
}

// Auth response interface
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Login DTO
export interface LoginDto {
  email: string;
  password: string;
}

// Register DTO
export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// Auth service hook
export const useAuthService = () => {
  const api = useApi();
  
  // Non-authenticated API instance for login/register
  const authApi = axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // API Gateway endpoints for auth
  const AUTH_ENDPOINT = '/auth';
  const USERS_ENDPOINT = '/users';
  
  return {
    // User login with email/password
    login: (data: LoginDto) => 
      authApi.post<AuthResponse>(`${AUTH_ENDPOINT}/login`, data),
      
    // User registration
    register: (data: RegisterDto) => 
      authApi.post<AuthResponse>(`${AUTH_ENDPOINT}/register`, data),
      
    // Firebase authentication
    firebaseLogin: (idToken: string) => 
      authApi.post<AuthResponse>(`${AUTH_ENDPOINT}/firebase-login`, { idToken }),
      
    // Refresh token
    refreshToken: (refreshToken: string) => 
      authApi.post<AuthResponse>(`${AUTH_ENDPOINT}/refresh-token`, { refreshToken }),
      
    // Get user profile (authenticated)
    getProfile: () => 
      api.get<User>(`${AUTH_ENDPOINT}/profile`),
      
    // Get all users (admin only)
    getUsers: (role?: UserRole) => 
      api.get<User[]>(USERS_ENDPOINT, { params: { role } }),
      
    // Get user by ID (admin only)
    getUser: (id: string) => 
      api.get<User>(`${USERS_ENDPOINT}/${id}`),
      
    // Create a new user (admin only)
    createUser: (data: RegisterDto & { role?: UserRole }) => 
      api.post<User>(USERS_ENDPOINT, data),
      
    // Update a user (admin only)
    updateUser: (id: string, data: Partial<RegisterDto & { role?: UserRole }>) => 
      api.patch<User>(`${USERS_ENDPOINT}/${id}`, data),
      
    // Delete a user (admin only)
    deleteUser: (id: string) => 
      api.delete<void>(`${USERS_ENDPOINT}/${id}`),
  };
};