import { api } from '@/services/api';
import { Models } from '@/types/types';

export type Area = Models['Area'];

const ENDPOINT = '/areas';

export const areaService = {
  getAll: async (): Promise<Area[]> => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching areas:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: number): Promise<Area> => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching area by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  create: async (area: Partial<Area>): Promise<Area> => {
    try {
      const response = await api.post(ENDPOINT, area);
      return response.data;
    } catch (error: any) {
      console.error('Error creating area:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: number, area: Partial<Area>): Promise<Area> => {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, area);
      return response.data;
    } catch (error: any) {
      console.error('Error updating area:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error: any) {
      console.error('Error deleting area:', error.response?.data || error.message);
      throw error;
    }
  },
};