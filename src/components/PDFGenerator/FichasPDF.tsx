import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

// Tipo de datos a mostrar
type ReportType = "normal" | "activas" | "inactivas" | "porAprendices" | "recientes";

interface FichasPDFProps {
  data: Partial<Models['Ficha']>[];
  startDate?: string;
  endDate?: string;
  reportType?: ReportType;
}

const FichasPDF: React.FC<FichasPDFProps> = ({ data, startDate, endDate, reportType = "normal" }) => {
  // Columnas para el reporte normal
  const normalColumns = [
    { header: 'ID', accessor: 'idFicha', width: '20%' },
    { header: 'Número de Ficha', accessor: 'numFicha', width: '30%' },
    { header: 'Cantidad de Aprendices', accessor: 'cantidadAprendices', width: '30%' },
    { header: 'Estado', accessor: 'activo', width: '20%' },
  ];

  // Columnas para reportes especiales
  const specialColumns = [
    { header: 'ID', accessor: 'idFicha', width: '20%' },
    { header: 'Número de Ficha', accessor: 'numFicha', width: '40%' },
    { header: 'Cantidad de Aprendices', accessor: 'cantidadAprendices', width: '40%' },
  ];

  // Columnas para reporte por cantidad de aprendices
  const aprendicesColumns = [
    { header: 'Rango de Aprendices', accessor: 'rango', width: '40%' },
    { header: 'Cantidad de Fichas', accessor: 'cantidad', width: '30%' },
    { header: 'Activas', accessor: 'activas', width: '15%' },
    { header: 'Inactivas', accessor: 'inactivas', width: '15%' },
  ];

  // Transformar los datos según el tipo de reporte
  let transformedData = [];
  let title = "Reporte de Fichas";
  let columns = normalColumns;

  switch (reportType) {
    case "normal":
      // Transformación para reporte normal
      transformedData = data.map(ficha => ({
        ...ficha,
        activo: ficha.activo ? 'Activo' : 'Inactivo'
      }));
      break;

    case "activas":
      title = "Reporte de Fichas Activas";
      columns = specialColumns;
      // Filtrar solo fichas activas
      transformedData = data.filter(ficha => ficha.activo);
      break;

    case "inactivas":
      title = "Reporte de Fichas Inactivas";
      columns = specialColumns;
      // Filtrar solo fichas inactivas
      transformedData = data.filter(ficha => !ficha.activo);
      break;

    case "porAprendices":
      title = "Reporte de Fichas por Cantidad de Aprendices";
      columns = aprendicesColumns;
      
      // Definir rangos de aprendices
      const rangos = [
        { min: 0, max: 10, label: '0-10 aprendices' },
        { min: 11, max: 20, label: '11-20 aprendices' },
        { min: 21, max: 30, label: '21-30 aprendices' },
        { min: 31, max: 40, label: '31-40 aprendices' },
        { min: 41, max: Infinity, label: 'Más de 40 aprendices' }
      ];
      
      // Inicializar contadores para cada rango
      const rangoContadores = rangos.map(rango => ({
        rango: rango.label,
        cantidad: 0,
        activas: 0,
        inactivas: 0
      }));
      
      // Contar fichas por rango
      data.forEach(ficha => {
        const cantidadAprendices = ficha.cantidadaprendices || 0;
        const rangoIndex = rangos.findIndex(rango => 
          cantidadAprendices >= rango.min && cantidadAprendices <= rango.max
        );
        
        if (rangoIndex !== -1) {
          rangoContadores[rangoIndex].cantidad += 1;
          if (ficha.activo) {
            rangoContadores[rangoIndex].activas += 1;
          } else {
            rangoContadores[rangoIndex].inactivas += 1;
          }
        }
      });
      
      // Filtrar rangos que tienen al menos una ficha
      transformedData = rangoContadores.filter(rango => rango.cantidad > 0);
      break;

    case "recientes":
      title = "Reporte de Fichas Recientes";
      // Ordenar por fecha de creación (más recientes primero)
      transformedData = [...data]
        .sort((a, b) => {
          if (!a.fechacreacion) return 1;
          if (!b.fechacreacion) return -1;
          return new Date(b.fechacreacion).getTime() - new Date(a.fechacreacion).getTime();
        })
        .slice(0, 10) // Tomar solo las 10 más recientes
        .map(ficha => ({
          ...ficha,
          activo: ficha.activo ? 'Activo' : 'Inactivo'
        }));
      break;
  }

  const dateRange = startDate && endDate 
    ? `Período: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`
    : 'Reporte completo';

  return (
    <PDFBase 
      title={title} 
      subtitle={dateRange}
    >
      <PDFTable columns={columns} data={transformedData} />
    </PDFBase>
  );
};

export default FichasPDF;