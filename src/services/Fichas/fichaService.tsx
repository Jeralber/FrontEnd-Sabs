import { api } from '@/services/api';
import { Models } from '@/types/types';

export type Ficha = Models['Ficha'];

const ENDPOINT = '/fichas';

export const fichaService = {
  getAll: async (): Promise<Ficha[]> => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching fichas:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: number): Promise<Ficha> => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching ficha by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  create: async (ficha: Partial<Ficha>): Promise<Ficha> => {
    try {
      const cleanedData: Partial<Ficha> = {
        numficha: typeof ficha.numficha === 'string' ? parseInt(ficha.numficha) : ficha.numficha,
        cantidadaprendices: typeof ficha.cantidadaprendices === 'string' ? 
          parseInt(ficha.cantidadaprendices) : ficha.cantidadaprendices
      };
      
      console.log('Creating new ficha with data:', JSON.stringify(cleanedData, null, 2));
      
      const response = await api.post(ENDPOINT, cleanedData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating ficha:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: number, ficha: Partial<Ficha>): Promise<Ficha> => {
    try {
      const cleanedData: Partial<Ficha> = {
        numficha: typeof ficha.numficha === 'string' ? parseInt(ficha.numficha) : ficha.numficha,
        cantidadaprendices: typeof ficha.cantidadaprendices === 'string' ? 
          parseInt(ficha.cantidadaprendices) : ficha.cantidadaprendices
      };
      
      console.log('Updating ficha with ID:', id);
      console.log('Cleaned data being sent:', JSON.stringify(cleanedData, null, 2));
      
      const response = await api.put(`${ENDPOINT}/${id}`, cleanedData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating ficha:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error: any) {
      console.error('Error deleting ficha:', error.response?.data || error.message);
      throw error;
    }
  },
};
