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
  const login = async (email: string, password: string): Promise<boolean> => {
    // Aquí va tu lógica de autenticación
    // Supongamos que tienes una función que valida el usuario:
    const user = await authService.login(email, password);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      // ...otros estados...
      return true;
    } else {
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