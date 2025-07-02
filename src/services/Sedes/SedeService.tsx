import { api } from '@/services/api';
import { Models } from '@/types/types';

export type Sede = Models['Sede'];

const ENDPOINT = '/sedes';

export const sedeService = {
  getAll: async (): Promise<Sede[]> => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching sedes:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: number): Promise<Sede> => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching sede by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  create: async (sede: Partial<Sede>): Promise<Sede> => {
    try {
      const response = await api.post(ENDPOINT, sede);
      return response.data;
    } catch (error: any) {
      console.error('Error creating sede:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: number, sede: Partial<Sede>): Promise<Sede> => {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, sede);
      return response.data;
    } catch (error: any) {
      console.error('Error updating sede:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error: any) {
      console.error('Error deleting sede:', error.response?.data || error.message);
      throw error;
    }
  },
};