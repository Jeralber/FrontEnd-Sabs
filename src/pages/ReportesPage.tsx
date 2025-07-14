import React from "react";
import { Card } from "@heroui/react";
import { FaFileAlt, FaUser, FaClipboard, FaGraduationCap, FaBuilding, FaUniversity, FaChartBar, FaMapMarkerAlt, FaExchangeAlt, FaBox, FaListAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
 
// Definimos interfaces para nuestros tipos
interface Modulo {
  id: string;
  nombre: string;
  icono: React.ReactNode;
  path: string;
}


const modulos: Modulo[] = [
  { id: "personas", nombre: "Personas", icono: <FaUser className="text-4xl" />, path: "/reportes/personas" },
  { id: "fichas", nombre: "Fichas", icono: <FaClipboard className="text-4xl" />, path: "/reportes/fichas" },
  { id: "titulados", nombre: "Titulados", icono: <FaGraduationCap className="text-4xl" />, path: "/reportes/titulados" },
  { id: "sedes", nombre: "Sedes", icono: <FaBuilding className="text-4xl" />, path: "/reportes/sedes" },
  { id: "centros", nombre: "Centros", icono: <FaUniversity className="text-4xl" />, path: "/reportes/centros" },
  { id: "areas", nombre: "Áreas", icono: <FaChartBar className="text-4xl" />, path: "/reportes/areas" },
  { id: "sitios", nombre: "Sitios", icono: <FaMapMarkerAlt className="text-4xl" />, path: "/reportes/sitios" },
  { id: "movimientos", nombre: "Movimientos", icono: <FaExchangeAlt className="text-4xl" />, path: "/reportes/movimientos" },
  { id: "materiales", nombre: "Materiales", icono: <FaBox className="text-4xl" />, path: "/reportes/materiales" },
  { id: "detalles", nombre: "Detalles", icono: <FaListAlt className="text-4xl" />, path: "/reportes/detalles" },
  { id: "municipios", nombre: "Municipios", icono: <FaListAlt className="text-4xl" />, path: "/reportes/municipios" },
];


const ReportesPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reportes del Sistema</h1>
      <p className="mb-6 text-gray-600">
        Selecciona un módulo para generar un reporte detallado.
      </p>

      {/* Grid de tarjetas de módulos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {modulos.map((modulo) => (
          <Link 
            key={modulo.id}
            to={modulo.path}
            className="text-decoration-none"
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="p-4 flex flex-col items-center">
                <div className="mb-2 text-green-600">{modulo.icono}</div>
                <h3 className="text-lg font-semibold mb-2">{modulo.nombre}</h3>
                <div className="mt-2 w-full flex items-center justify-center text-green-600">
                  <FaFileAlt className="mr-2" />
                  Ver Reportes
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReportesPage;
