{/* import React, { useState, useEffect } from "react";
import { Card, Button } from "@heroui/react";
import { useLocation } from "react-router-dom";
import FichasReporteBoton from "../reportes/components/PDFDownloadButton";

// Create a wrapper component with the correct props
interface FichasReporteWrapperProps {
  fechaInicio: Date;
  fechaFin: Date;
  className?: string;
}

const FichasReporteWrapper: React.FC<FichasReporteWrapperProps> = ({ 
  fechaInicio, 
  fechaFin, 
  className 
}) => {
  // Convert dates to string format if needed by the original component
  const startDate = fechaInicio.toISOString().split('T')[0];
  const endDate = fechaFin.toISOString().split('T')[0];
  
  // Pass only the props that the original component accepts
  return <FichasReporteBoton 
    startDate={startDate}
    endDate={endDate}
    className={className}
  />;
};

const FichasPage: React.FC = () => {
  const location = useLocation();
  const [mostrarReporte, setMostrarReporte] = useState<boolean>(false);
  const [fechaInicio, setFechaInicio] = useState<Date>(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [fechaFin, setFechaFin] = useState<Date>(new Date());

  // Detectar parámetros de URL al cargar la página
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reporte = params.get("reporte");
    
    if (reporte === "true") {
      const fechaInicioParam = params.get("fechaInicio");
      const fechaFinParam = params.get("fechaFin");
      
      if (fechaInicioParam) {
        setFechaInicio(new Date(fechaInicioParam));
      }
      
      if (fechaFinParam) {
        setFechaFin(new Date(fechaFinParam));
      }
      
      setMostrarReporte(true);
    }
  }, [location]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Fichas</h1>
        
        {/* Mostrar el botón de reporte solo si se solicitó */}/*
        {mostrarReporte && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex flex-col items-center">
            <h3 className="text-lg font-medium text-green-800 mb-2">
              ¡Reporte listo para descargar!
            </h3>
            <p className="text-sm text-green-600 mb-4">
              Período: {fechaInicio.toLocaleDateString()} - {fechaFin.toLocaleDateString()}
            </p>
            <FichasReporteWrapper 
              fechaInicio={fechaInicio} 
              fechaFin={fechaFin} 
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
            />
          </div>
        )}
      </div>
      
      {/* Resto del contenido de la página *//*
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Fichas Activas</h2>
          <p className="text-gray-600 mb-4">
            Visualiza y gestiona las fichas activas en el sistema.
          </p>
          <Button className="w-full">Ver Fichas Activas</Button>
        </Card>
        
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Crear Ficha</h2>
          <p className="text-gray-600 mb-4">
            Crea una nueva ficha en el sistema.
          </p>
          <Button className="w-full">Nueva Ficha</Button>
        </Card>
        
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Histórico</h2>
          <p className="text-gray-600 mb-4">
            Consulta el histórico de fichas completadas.
          </p>
          <Button className="w-full">Ver Histórico</Button>
        </Card>
      </div>
    </div>
  );
};

export default FichasPage;

*/