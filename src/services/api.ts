import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useAuth } from '../contexts/AuthContext';

// API client configuration
const api = axios.create({
  baseURL: '/api', // This will be proxied to the API gateway in the Vite config
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - could trigger a refresh token flow here
      // or redirect to login
      console.error('Authentication error:', error);
    }
    return Promise.reject(error);
  }
);

// Hook for using the API with authentication
export const useApi = () => {
  const { getToken } = useAuth();
  
  // Create a request function that automatically adds authentication
  const authenticatedRequest = async <T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any,
    customConfig: AxiosRequestConfig = {}
  ): Promise<T> => {
    try {
      // Get the token
      const token = await getToken();
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      // Merge the custom config with auth headers
      const config: AxiosRequestConfig = {
        ...customConfig,
        headers: {
          ...customConfig.headers,
          Authorization: `Bearer ${token}`,
          'X-Api-Version': 'v1'
        },
      };
      
      let response;
      
      if (method === 'get' || method === 'delete') {
        response = await api[method]<T>(url, config);
      } else {
        response = await api[method]<T>(url, data, config);
      }
      
      return response.data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };
  
  return {
    get: <T>(url: string, config?: AxiosRequestConfig) => 
      authenticatedRequest<T>('get', url, undefined, config),
    post: <T>(url: string, data: any, config?: AxiosRequestConfig) => 
      authenticatedRequest<T>('post', url, data, config),
    put: <T>(url: string, data: any, config?: AxiosRequestConfig) => 
      authenticatedRequest<T>('put', url, data, config),
    patch: <T>(url: string, data: any, config?: AxiosRequestConfig) => 
      authenticatedRequest<T>('patch', url, data, config),
    delete: <T>(url: string, config?: AxiosRequestConfig) => 
      authenticatedRequest<T>('delete', url, undefined, config),
  };
};

// Export the base API for non-authenticated requests
export default api;