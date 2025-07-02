import { api } from '@/services/api';
import { Models } from '@/types/types';

export type Rol = Models['Rol'];

const ENDPOINT = '/roles';

export const rolService = {
  getAll: async (): Promise<Rol[]> => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching roles:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: number): Promise<Rol> => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching rol by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  create: async (rol: Partial<Rol>): Promise<Rol> => {
    try {
      const cleanedData: Partial<Rol> = {
        nombrerol: rol.nombrerol
      };
      
      console.log('Creating new rol with data:', JSON.stringify(cleanedData, null, 2));
      
      const response = await api.post(ENDPOINT, cleanedData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating rol:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: number, rol: Partial<Rol>): Promise<Rol> => {
    try {
      const cleanedData: Partial<Rol> = {
        nombrerol: rol.nombrerol,
        fechaactualización: new Date() 
      };
      
      console.log('Updating rol with ID:', id);
      console.log('Cleaned data being sent:', JSON.stringify(cleanedData, null, 2));
      
      const response = await api.put(`${ENDPOINT}/${id}`, cleanedData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating rol:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error: any) {
      console.error('Error deleting rol:', error.response?.data || error.message);
      throw error;
    }
  },
};