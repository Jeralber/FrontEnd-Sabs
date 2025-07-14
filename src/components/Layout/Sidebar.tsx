import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronRight, FaUserCog, FaChartBar, FaTable, FaHome, FaExchangeAlt } from 'react-icons/fa';


interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  path?: string;
  children?: SidebarItem[];
}

const Sidebar: React.FC = () => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    modulos: false,
    sitios: false,
    movimientos: false,
    materiales: false
  });

  const sidebarItems: SidebarItem[] = [
    {
      title: 'Dashboard',
      icon: <FaHome className="w-5 h-5" />,
      path: '/'
    },
    {
      title: 'Administrador',
      icon: <FaUserCog className="w-5 h-5" />, 
          children: [
           
          ]
    },

    {
      title: 'Models',
      icon: <FaTable className="w-5 h-5" />,
      children: [
        { title: 'Personas', icon: <></>, path: '/personas' },
        { title: 'Áreas', icon: <></>, path: '/areas' },
        { title: 'Centros', icon: <></>, path: '/centros' },
        { title: 'Sedes', icon: <></>, path: '/sedes' },
        { title: 'Fichas', icon: <></>, path: '/fichas' },
        { title: 'Titulados', icon: <></>, path: '/titulados' },
        { title: 'Municipios', icon: <></>, path: '/municipios' },

        { 
          title: 'Sitios', 
          icon: <></>, 
          children: [
            { title: 'Gestión de Sitios', icon: <></>, path: '/sitios' },
            { title: 'Tipos de Sitio', icon: <></>, path: '/tipos-sitio' }
          ]
        },
        { 
          title: 'Movimientos', 
          icon: <></>, 
          children: [
            { title: 'Gestión de Movimientos', icon: <></>, path: '/movimientos' },
            { title: 'Tipos de Movimiento', icon: <></>, path: '/tipos-movimiento' }
          ]
        },
        {
          title: 'Materiales',
          icon: <></>, 
              children: [
               { title: 'Gestión de Materiales', icon: <></>, path: '/materiales' },
               { title: 'Tipos de Material', icon: <></>, path: '/tipos-material' },
               { title: 'Categorias Material', icon: <></>, path: '/categorias' },
               { title: 'Unidad De Medida', icon: <></>, path: '/medidas' },
              ]
        },
      ]
    },
    {
      title: 'Detalles',
      icon: <FaExchangeAlt  className="w-5 h-5" />,
      path: '/detalles'
    },
    {
      title: 'Reportes',
      icon: <FaChartBar className="w-5 h-5" />,
      path: '/reportes'
    },
    
  ];

  const toggleMenu = (menuName: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const renderSidebarItems = (items: SidebarItem[], level = 0) => {
    return items.map((item, index) => {
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = openMenus[item.title.toLowerCase()];
      
      return (
        <div key={index} className={`w-full ${level > 0 ? 'pl-4' : ''}`}>
          {item.path && !hasChildren ? (
            <Link
              to={item.path}
              className="flex items-center p-2 text-gray-200 hover:bg-green-700 rounded-md transition-all"
            >
              <span className="mr-2">{item.icon}</span>
              <span>{item.title}</span>
            </Link>
          ) : (
            <button
              onClick={() => toggleMenu(item.title.toLowerCase())}
              className="flex items-center justify-between w-full p-2 text-gray-200 hover:bg-green-700 rounded-md transition-all"
            >
              <div className="flex items-center">
                <span className="mr-2">{item.icon}</span>
                <span>{item.title}</span>
              </div>
              {hasChildren && (
                <span>
                  {isOpen ? <FaChevronDown className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />}
                </span>
              )}
            </button>
          )}
          
          {hasChildren && isOpen && (
            <div className="mt-1 ml-2 border-l border-gray-600">
              {item.children && renderSidebarItems(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="h-screen w-64 bg-green-600 text-white flex flex-col">
      <div className="p-4 border-b border-green-700 flex items-center">
        <img src="public\imagen.png" alt="Logo" className="h-8 w-8 mr-2" />
        <h1 className="text-xl font-bold">INVENTORY</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {renderSidebarItems(sidebarItems)}
      </div>
    </div>
  );
};

export default Sidebar;