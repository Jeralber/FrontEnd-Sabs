import { api } from '@/services/api';
import { Models } from '@/types/types';

export type User = Pick<Models['Persona'], 'idpersona' | 'nombre' | 'apellido' | 'correo'> & {
  rol?: Partial<Models['Rol']>;
  Rol?: string;
};

export const authService = {
  login: async (correo: string, contrasena: string): Promise<User | null> => {
    try {
      const response = await api.post('/auth/login', { correo, contrasena });
      const user = response.data.user;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      return null;
    }
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user data', e);
      localStorage.removeItem('user');
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('user');
  },

  fetchProfile: async (): Promise<User | null> => {
    try {
      const response = await api.get('/auth/me');
      const user = response.data;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }
};