import { api } from '@/services/api';
import { Models } from '@/types/types';

export type AreaCentro = Models['AreaCentro'];

const ENDPOINT = '/areacentros';

export const areaCentroService = {
  getAll: async (): Promise<AreaCentro[]> => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching area-centros:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: number): Promise<AreaCentro> => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching area-centro by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  create: async (areaCentro: Partial<AreaCentro>): Promise<AreaCentro> => {
    try {
      const response = await api.post(ENDPOINT, areaCentro);
      return response.data;
    } catch (error: any) {
      console.error('Error creating area-centro:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: number, areaCentro: Partial<AreaCentro>): Promise<AreaCentro> => {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, areaCentro);
      return response.data;
    } catch (error: any) {
      console.error('Error updating area-centro:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error: any) {
      console.error('Error deleting area-centro:', error.response?.data || error.message);
      throw error;
    }
  },
};