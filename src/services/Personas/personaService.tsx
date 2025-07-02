import { api } from '@/services/api';
import { Models } from '@/types/types';

export type Persona = Models['Persona'];

const ENDPOINT = '/personas';

export const personaService = {
  getAll: async (): Promise<Persona[]> => {
    const response = await api.get(ENDPOINT);
    return response.data;
  },

  getById: async (id: number): Promise<Persona> => {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  },

  create: async (persona: Partial<Persona>): Promise<Persona> => {
    try {
      const cleanedData: Partial<Persona> = {
        identificacion: persona.identificacion,
        nombre: persona.nombre,
        apellido: persona.apellido,
        telefono: persona.telefono,
        correo: persona.correo,
        contrasena: persona.contrasena,
        edad: typeof persona.edad === 'string' ? parseInt(persona.edad) : persona.edad,
        ficha: persona.ficha,
        rol: persona.rol
      };
      
      console.log('Creating new persona with data:', JSON.stringify(cleanedData, null, 2));
      
      const response = await api.post(ENDPOINT, cleanedData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating persona:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: number, persona: Partial<Persona>): Promise<Persona> => {
    try {
      const cleanedData: Partial<Persona> = {
        identificacion: persona.identificacion,
        nombre: persona.nombre,
        apellido: persona.apellido,
        telefono: persona.telefono,
        correo: persona.correo,
        edad: typeof persona.edad === 'string' ? parseInt(persona.edad) : persona.edad,
        ficha: persona.ficha,
        rol: persona.rol
      };
      
      console.log('Updating persona with ID:', id);
      console.log('Cleaned data being sent:', JSON.stringify(cleanedData, null, 2));
      
      const response = await api.put(`${ENDPOINT}/${id}`, cleanedData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating persona:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};