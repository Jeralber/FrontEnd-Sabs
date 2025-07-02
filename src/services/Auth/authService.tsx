import { api } from '@/services/api';
import { Models } from '@/types/types';


export type User = Pick<Models['Persona'], 'idpersona' | 'nombre' | 'apellido' | 'correo'> & {
  rol?: Partial<Models['Rol']>; 
  Rol?: string; 
};

export const authService = {
  login: async (correo: string, contrasena: string): Promise<boolean> => {
    try {
      const response = await api.post('/personas/login', { correo, contrasena });
      
      console.log('Respuesta completa del login:', response.data);
      
      if (response.data) {
        // Extraer token y datos del usuario
        const token = response.data.token;
        const userData = response.data.user || response.data.persona || response.data;
        
        console.log('Datos de usuario extraídos:', userData);
        
        // Guardar el token
        if (token) {
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        
        // Guardar los datos del usuario
        if (userData) {
          const userToStore = {
            ...userData,
            rol: typeof userData.rol === 'string' || typeof userData.rol === 'number' 
              ? { nombreRol: userData.rol } 
              : userData.rol
          };
          
          console.log('Usuario a guardar en localStorage:', userToStore);
          localStorage.setItem('user', JSON.stringify(userToStore));
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    delete api.defaults.headers.common['Authorization'];
    window.location.href = '/login';
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr || userStr === 'undefined') return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user data', e);
      localStorage.removeItem('user'); 
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    if (token) {
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true;
    }
    return false;
  },
  
  
  initAuth: () => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
};

authService.initAuth();