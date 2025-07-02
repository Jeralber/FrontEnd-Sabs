import { api } from '@/services/api';
import { Models } from '@/types/types';

export type Sitio = Models['Sitio'];

const ENDPOINT = '/sitios';

export const sitioService = {
  getAll: async (): Promise<Sitio[]> => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching sitios:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: number): Promise<Sitio> => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching sitio by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  create: async (sitio: Partial<Sitio>): Promise<Sitio> => {
    try {
      const response = await api.post(ENDPOINT, sitio);
      return response.data;
    } catch (error: any) {
      console.error('Error creating sitio:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: number, sitio: Partial<Sitio>): Promise<Sitio> => {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, sitio);
      return response.data;
    } catch (error: any) {
      console.error('Error updating sitio:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error: any) {
      console.error('Error deleting sitio:', error.response?.data || error.message);
      throw error;
    }
  },
};