import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '@/services/Auth/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => false,
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      const isAuth = authService.isAuthenticated();
      
      setUser(currentUser);
      setLoading(false);
      

      if (!isAuth && currentUser) {
        authService.logout();
      }
    };

    initAuth();
  }, []);

  // En la función login del contexto
  const login = async (correo: string, contrasena: string) => {
    try {
      const success = await authService.login(correo, contrasena);
      if (success) {
        const currentUser = authService.getCurrentUser();
        console.log('Usuario después del login:', currentUser);
        setUser(currentUser);
      }
      return success;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && authService.isAuthenticated(),
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};