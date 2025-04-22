import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// Create an axios instance
const api = axios.create({
  baseURL: '/api', // This will be proxied in development through Vite config
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hook for using the API with authentication
export const useApi = () => {
  const { getToken } = useAuth();
  
  // Create a request function that automatically adds authentication
  const authenticatedRequest = async <T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any
  ): Promise<T> => {
    try {
      // Get the token
      const token = await getToken();
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      // Make the authenticated request
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
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
    get: <T>(url: string) => authenticatedRequest<T>('get', url),
    post: <T>(url: string, data: any) => authenticatedRequest<T>('post', url, data),
    put: <T>(url: string, data: any) => authenticatedRequest<T>('put', url, data),
    delete: <T>(url: string) => authenticatedRequest<T>('delete', url),
  };
};

export default api; 