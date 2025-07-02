import { api } from '@/services/api';
import { Models } from '@/types/types';

export type UnidadMedida = Models['UnidadMedida'];

const ENDPOINT = '/unidadmedidas';

export const unidadMedidaService = {
  getAll: async (): Promise<UnidadMedida[]> => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching unidades de medida:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: number): Promise<UnidadMedida> => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching unidad de medida by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  create: async (unidadMedida: Partial<UnidadMedida>): Promise<UnidadMedida> => {
    try {
      const response = await api.post(ENDPOINT, unidadMedida);
      return response.data;
    } catch (error: any) {
      console.error('Error creating unidad de medida:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: number, unidadMedida: Partial<UnidadMedida>): Promise<UnidadMedida> => {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, unidadMedida);
      return response.data;
    } catch (error: any) {
      console.error('Error updating unidad de medida:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error: any) {
      console.error('Error deleting unidad de medida:', error.response?.data || error.message);
      throw error;
    }
  },
};