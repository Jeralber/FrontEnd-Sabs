import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FaFilePdf, FaCheckCircle, FaTimesCircle, FaBuilding, FaClock } from "react-icons/fa";
import SedesPDF from './SedesPDF';
import { Models } from '../../types/types';

// Tipo de datos a mostrar
type ReportType = "normal" | "activas" | "inactivas" | "porCentro" | "recientes";

interface SedeReportSelectorProps {
  data: Partial<Models['Sede']>[];
  startDate?: string;
  endDate?: string;
}

const SedeReportSelector: React.FC<SedeReportSelectorProps> = ({ data, startDate, endDate }) => {
  const [reportType, setReportType] = useState<ReportType>("normal");
  
  // Función para obtener el nombre del reporte
  const getReportName = (type: ReportType): string => {
    switch (type) {
      case "normal": return "Reporte Estándar";
      case "activas": return "Sedes Activas";
      case "inactivas": return "Sedes Inactivas";
      case "porCentro": return "Por Centro";
      case "recientes": return "Sedes Recientes";
      default: return "Reporte";
    }
  };
  
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium mb-4">Descargar Reportes PDF</h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          onClick={() => setReportType("normal")}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
            reportType === "normal" 
              ? "bg-green-600 text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <FaFilePdf size={14} />
          <span>Reporte Estándar</span>
        </button>
        
        <button 
          onClick={() => setReportType("activas")}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
            reportType === "activas" 
              ? "bg-green-600 text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <FaCheckCircle size={14} />
          <span>Sedes Activas</span>
        </button>
        
        <button 
          onClick={() => setReportType("inactivas")}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
            reportType === "inactivas" 
              ? "bg-green-600 text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <FaTimesCircle size={14} />
          <span>Sedes Inactivas</span>
        </button>
        
        <button 
          onClick={() => setReportType("porCentro")}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
            reportType === "porCentro" 
              ? "bg-green-600 text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <FaBuilding size={14} />
          <span>Por Centro</span>
        </button>
        
        <button 
          onClick={() => setReportType("recientes")}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
            reportType === "recientes" 
              ? "bg-green-600 text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <FaClock size={14} />
          <span>Sedes Recientes</span>
        </button>
      </div>
      
      <PDFDownloadLink 
        document={<SedesPDF data={data} startDate={startDate} endDate={endDate} reportType={reportType} />} 
        fileName={`reporte-sedes-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`}
        className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2 w-fit"
      >
        {({ loading }) => (
          <>
            {loading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                <span>Generando PDF...</span>
              </>
            ) : (
              <>
                <FaFilePdf />
                <span>Descargar {getReportName(reportType)}</span>
              </>
            )}
          </>
        )}
      </PDFDownloadLink>
    </div>
  );
};

export default SedeReportSelector;