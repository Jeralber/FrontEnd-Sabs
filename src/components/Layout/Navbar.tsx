import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaUser, FaBell, FaMoon, FaSun, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Verificar datos de usuario
  useEffect(() => {
    if (user) {
      console.log('Datos de usuario en Navbar:', user);
    }
  }, [user]);

  // Cargar preferencia de tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  // Función mejorada para obtener el nombre del usuario
  const getUserName = () => {
    if (!user) return 'Usuario';
    
    try {
      // Verificar la estructura del usuario en la consola para depuración
      console.log('Estructura del usuario:', user);
      
      // Verificar si el usuario tiene nombre y apellido
      if (user.nombre && user.apellido) {
        return `${user.nombre} ${user.apellido}`;
      }
      
      // Si solo tiene nombre
      if (user.nombre) {
        return user.nombre;
      }
      
      // Si tiene correo, usar la parte antes del @
      if (user.correo) {
        return user.correo.split('@')[0];
      }
    } catch (error) {
      console.error('Error al obtener nombre de usuario:', error);
    }
    
    return 'Usuario';
  };
  
  // Función mejorada para obtener el rol del usuario
  const getRolName = () => {
    if (!user) return 'Sin rol asignado';
    
    try {
      // Si el rol es un objeto con nombrerol
      if (user.rol && typeof user.rol === 'object' && user.rol.nombrerol) {
        return user.rol.nombrerol;
      }
      
      // Si el rol es un string
      if (user.rol && typeof user.rol === 'string') {
        return user.rol;
      }
      
      // Si existe idrol, mostrar "Rol #X"
      if (user.rol?.idrol) {
        return `Rol #${user.rol?.idrol}`;
      }
    } catch (error) {
      console.error('Error al obtener rol de usuario:', error);
    }
    
    return 'Usuario';
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md h-16 flex items-center justify-between px-4">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
        >
          <FaBars className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {darkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
        </button>
        
        {/* Botón de notificaciones con dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Notificaciones"
          >
            <div className="relative">
              <FaBell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </div>
          </button>
          
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Notificaciones</p>
              </div>
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                No tienes notificaciones nuevas
              </div>
            </div>
          )}
        </div>
        
        {/* Perfil de usuario con dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
              <FaUser className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                {getUserName()}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {getRolName()}
              </span>
            </div>
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{getUserName()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rol: {getRolName()}</p>
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;