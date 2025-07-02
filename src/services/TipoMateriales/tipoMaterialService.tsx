import { api } from '@/services/api';
import { Models } from '@/types/types';

export type TipoMaterial = Models['TipoMaterial'];

const ENDPOINT = '/tipomateriales';

export const tipoMaterialService = {
  getAll: async (): Promise<TipoMaterial[]> => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching tipos de material:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: number): Promise<TipoMaterial> => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching tipo de material by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  create: async (tipoMaterial: Partial<TipoMaterial>): Promise<TipoMaterial> => {
    try {
      const response = await api.post(ENDPOINT, tipoMaterial);
      return response.data;
    } catch (error: any) {
      console.error('Error creating tipo de material:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: number, tipoMaterial: Partial<TipoMaterial>): Promise<TipoMaterial> => {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, tipoMaterial);
      return response.data;
    } catch (error: any) {
      console.error('Error updating tipo de material:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error: any) {
      console.error('Error deleting tipo de material:', error.response?.data || error.message);
      throw error;
    }
  },
};