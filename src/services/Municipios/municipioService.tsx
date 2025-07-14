import { api } from '@/services/api';
import { Models } from '@/types/types';

export type Municipio = Models['Municipio'];

const ENDPOINT = '/municipios';

export const municipioService = {
  getAll: async (): Promise<Municipio[]> => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching municipios:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: number): Promise<Municipio> => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching municipio by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  create: async (municipio: Partial<Municipio>): Promise<Municipio> => {
    try {
      const response = await api.post(ENDPOINT, municipio);
      return response.data;
    } catch (error: any) {
      console.error('Error creating municipio:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: number, municipio: Partial<Municipio>): Promise<Municipio> => {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, municipio);
      return response.data;
    } catch (error: any) {
      console.error('Error updating municipio:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error: any) {
      console.error('Error deleting municipio:', error.response?.data || error.message);
      throw error;
    }
  },
};