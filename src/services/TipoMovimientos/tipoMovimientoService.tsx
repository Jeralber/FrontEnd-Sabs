import { api } from '@/services/api';
import { Models } from '@/types/types';

export type TipoMovimiento = Models['TipoMovimiento'];

const ENDPOINT = '/tipomovimientos';

export const tipoMovimientoService = {
  getAll: async (): Promise<TipoMovimiento[]> => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching tipos de movimiento:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: number): Promise<TipoMovimiento> => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching tipo de movimiento by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  create: async (tipoMovimiento: Partial<TipoMovimiento>): Promise<TipoMovimiento> => {
    try {
      const response = await api.post(ENDPOINT, tipoMovimiento);
      return response.data;
    } catch (error: any) {
      console.error('Error creating tipo de movimiento:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: number, tipoMovimiento: Partial<TipoMovimiento>): Promise<TipoMovimiento> => {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, tipoMovimiento);
      return response.data;
    } catch (error: any) {
      console.error('Error updating tipo de movimiento:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error: any) {
      console.error('Error deleting tipo de movimiento:', error.response?.data || error.message);
      throw error;
    }
  },
};