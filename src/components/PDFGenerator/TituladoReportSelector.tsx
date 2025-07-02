import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FaFilePdf, FaCheckCircle, FaTimesCircle, FaLayerGroup, FaUserGraduate } from "react-icons/fa";
import TituladosPDF from './TituladosPDF';
import { Models } from '../../types/types';

// Tipo de datos a mostrar
type ReportType = "normal" | "activos" | "inactivos" | "porArea" | "porFicha";

interface TituladoReportSelectorProps {
  data: Partial<Models['Titulado']>[];
  startDate?: string;
  endDate?: string;
}

const TituladoReportSelector: React.FC<TituladoReportSelectorProps> = ({ data, startDate, endDate }) => {
  const [reportType, setReportType] = useState<ReportType>("normal");
  
  // Función para obtener el nombre del reporte
  const getReportName = (type: ReportType): string => {
    switch (type) {
      case "normal": return "Reporte Estándar";
      case "activos": return "Titulados Activos";
      case "inactivos": return "Titulados Inactivos";
      case "porArea": return "Por Área";
      case "porFicha": return "Por Ficha";
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
          onClick={() => setReportType("activos")}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
            reportType === "activos" 
              ? "bg-green-600 text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <FaCheckCircle size={14} />
          <span>Titulados Activos</span>
        </button>
        
        <button 
          onClick={() => setReportType("inactivos")}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
            reportType === "inactivos" 
              ? "bg-green-600 text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <FaTimesCircle size={14} />
          <span>Titulados Inactivos</span>
        </button>
        
        <button 
          onClick={() => setReportType("porArea")}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
            reportType === "porArea" 
              ? "bg-green-600 text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <FaLayerGroup size={14} />
          <span>Por Área</span>
        </button>
        
        <button 
          onClick={() => setReportType("porFicha")}
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
            reportType === "porFicha" 
              ? "bg-green-600 text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <FaUserGraduate size={14} />
          <span>Por Ficha</span>
        </button>
      </div>
      
      <PDFDownloadLink 
        document={<TituladosPDF data={data} startDate={startDate} endDate={endDate} reportType={reportType} />} 
        fileName={`reporte-titulados-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`}
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

export default TituladoReportSelector;