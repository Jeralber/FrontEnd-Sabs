import { api } from '@/services/api';
import { Models } from '@/types/types';

export type Movimiento = Models['Movimiento'];

const ENDPOINT = '/movimientos';

export const movimientoService = {
  getAll: async (): Promise<Movimiento[]> => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching movimientos:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: number): Promise<Movimiento> => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching movimiento by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  create: async (movimiento: Partial<Movimiento>): Promise<Movimiento> => {
    try {
      const response = await api.post(ENDPOINT, movimiento);
      return response.data;
    } catch (error: any) {
      console.error('Error creating movimiento:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: number, movimiento: Partial<Movimiento>): Promise<Movimiento> => {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, movimiento);
      return response.data;
    } catch (error: any) {
      console.error('Error updating movimiento:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error: any) {
      console.error('Error deleting movimiento:', error.response?.data || error.message);
      throw error;
    }
  },
};