import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FaFilePdf, FaCheckCircle, FaTimesCircle, FaUserFriends, FaClock } from "react-icons/fa";
import FichasPDF from './FichasPDF';
import { Models } from '../../types/types';

// Tipo de datos a mostrar
type ReportType = "normal" | "activas" | "inactivas" | "porAprendices" | "recientes";

interface FichaReportSelectorProps {
  data: Partial<Models['Ficha']>[];
  startDate?: string;
  endDate?: string;
}

const FichaReportSelector: React.FC<FichaReportSelectorProps> = ({ data, startDate, endDate }) => {
  const [reportType, setReportType] = useState<ReportType>("normal");
  
  // Función para obtener el nombre del reporte
  const getReportName = (type: ReportType): string => {
    switch (type) {
      case "normal": return "Reporte Estándar";
      case "activas": return "Fichas Activas";
      case "inactivas": return "Fichas Inactivas";
      case "porAprendices": return "Por Cantidad de Aprendices";
      case "recientes": return "Fichas Recientes";
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
          <span>Fichas Activas</span>
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
          <span>Fichas Inactivas</span>
        </button>
        
        <button 
          onClick={() => setReportType("porAprendices")}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
            reportType === "porAprendices" 
              ? "bg-green-600 text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <FaUserFriends size={14} />
          <span>Por Cantidad de Aprendices</span>
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
          <span>Fichas Recientes</span>
        </button>
      </div>
      
      <PDFDownloadLink 
        document={<FichasPDF data={data} startDate={startDate} endDate={endDate} reportType={reportType} />} 
        fileName={`reporte-fichas-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`}
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

export default FichaReportSelector;