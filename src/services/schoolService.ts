import { useApi } from './api';

// School interface
export interface School {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  type?: string;
  geoLat?: number;
  geoLng?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Creation DTO
export interface CreateSchoolDto {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  type?: string;
  geoLat?: number;
  geoLng?: number;
  active?: boolean;
}

// Update DTO
export interface UpdateSchoolDto extends Partial<CreateSchoolDto> {}

// School service hook
export const useSchoolService = () => {
  const api = useApi();
  
  return {
    // Get all schools
    getSchools: () => api.get<School[]>('/schools'),
    
    // Get school by ID
    getSchool: (id: string) => api.get<School>(`/schools/${id}`),
    
    // Create a new school
    createSchool: (data: CreateSchoolDto) => api.post<School>('/schools', data),
    
    // Update a school
    updateSchool: (id: string, data: UpdateSchoolDto) => api.put<School>(`/schools/${id}`, data),
    
    // Delete a school
    deleteSchool: (id: string) => api.delete<void>(`/schools/${id}`),
  };
}; 