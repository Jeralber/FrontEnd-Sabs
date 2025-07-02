import { api } from '@/services/api';
import { Models } from '@/types/types';

export type TipoSitio = Models['TipoSitio'];

const ENDPOINT = '/tipositios';

export const tipoSitioService = {
  getAll: async (): Promise<TipoSitio[]> => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching tipos de sitio:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: number): Promise<TipoSitio> => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching tipo de sitio by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  create: async (tipoSitio: Partial<TipoSitio>): Promise<TipoSitio> => {
    try {
      const response = await api.post(ENDPOINT, tipoSitio);
      return response.data;
    } catch (error: any) {
      console.error('Error creating tipo de sitio:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: number, tipoSitio: Partial<TipoSitio>): Promise<TipoSitio> => {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, tipoSitio);
      return response.data;
    } catch (error: any) {
      console.error('Error updating tipo de sitio:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error: any) {
      console.error('Error deleting tipo de sitio:', error.response?.data || error.message);
      throw error;
    }
  },
};