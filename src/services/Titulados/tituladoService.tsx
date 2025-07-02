import { api } from "@/services/api";
import { Models } from "@/types/types";

export type Titulado = Models["Titulado"];

const ENDPOINT = "/titulados";

export const tituladoService = {
  getAll: async (): Promise<Titulado[]> => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching titulados:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getById: async (id: number): Promise<Titulado> => {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching titulado by ID:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  create: async (titulado: Partial<Titulado>): Promise<Titulado> => {
    try {
      const response = await api.post(ENDPOINT, titulado);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error creating titulado:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  update: async (
    id: number,
    titulado: Partial<Titulado>
  ): Promise<Titulado> => {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, titulado);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error updating titulado:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error: any) {
      console.error(
        "Error deleting titulado:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
