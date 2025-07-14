import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

// Tipo de datos a mostrar
type ReportType = "normal" | "activas" | "inactivas" | "recientes" | "antiguas";

interface AreasPDFProps {
  data: Partial<Models['Area']>[];
  startDate?: string;
  endDate?: string;
  reportType?: ReportType;
}

const AreasPDF: React.FC<AreasPDFProps> = ({ data, startDate, endDate, reportType = "normal" }) => {
  // Columnas para el reporte normal
  const normalColumns = [
    { header: 'ID', accessor: 'idarea', width: '20%' },
    { header: 'Área', accessor: 'area', width: '40%' },
    { header: 'Estado', accessor: 'activo', width: '20%' },
    { header: 'Fecha Creación', accessor: 'fechacreacion', width: '20%' },
  ];

  // Columnas para reportes especiales
  const specialColumns = [
    { header: 'ID', accessor: 'idarea', width: '20%' },
    { header: 'Área', accessor: 'area', width: '60%' },
    { header: 'Fecha Creación', accessor: 'fechacreacion', width: '20%' },
  ];

  // Columnas para reportes de antigüedad
  const timeColumns = [
    { header: 'ID', accessor: 'idarea', width: '15%' },
    { header: 'Área', accessor: 'area', width: '45%' },
    { header: 'Fecha Creación', accessor: 'fechacreacion', width: '20%' },
    { header: 'Antigüedad (días)', accessor: 'antiguedad', width: '20%' },
  ];

  // Transformar los datos según el tipo de reporte
  let transformedData = [];
  let title = "Reporte de Áreas";
  let columns = normalColumns;

  // Función para calcular la antigüedad en días
  const calcularAntiguedad = (fechacreacion: string | Date): number => {
    if (!fechacreacion) return 0;
    const fecha = new Date(fechacreacion);
    const hoy = new Date();
    const diferencia = hoy.getTime() - fecha.getTime();
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  };

  switch (reportType) {
    case "normal":
      // Transformación para reporte normal
      transformedData = data.map(area => ({
        ...area,
        activo: area.activo ? 'Activo' : 'Inactivo',
        fechacreacion: area.fechacreacion ? new Date(area.fechacreacion).toLocaleDateString('es-ES') : '-'
      }));
      break;

    case "activas":
      title = "Reporte de Áreas Activas";
      columns = specialColumns;
      // Filtrar solo áreas activas
      transformedData = data
        .filter(area => area.activo)
        .map(area => ({
          ...area,
          fechacreacion: area.fechacreacion ? new Date(area.fechacreacion).toLocaleDateString('es-ES') : '-'
        }));
      break;

    case "inactivas":
      title = "Reporte de Áreas Inactivas";
      columns = specialColumns;
      // Filtrar solo áreas inactivas
      transformedData = data
        .filter(area => !area.activo)
        .map(area => ({
          ...area,
          fechacreacion: area.fechacreacion ? new Date(area.fechacreacion).toLocaleDateString('es-ES') : '-'
        }));
      break;

    case "recientes":
      title = "Reporte de Áreas Recientes";
      columns = timeColumns;
      // Ordenar por fecha de creación (más recientes primero)
      transformedData = [...data]
        .sort((a, b) => {
          if (!a.fechacreacion) return 1;
          if (!b.fechacreacion) return -1;
          return new Date(b.fechacreacion).getTime() - new Date(a.fechacreacion).getTime();
        })
        .slice(0, 10) // Tomar solo las 10 más recientes
        .map(area => ({
          ...area,
          activo: area.activo ? 'Activo' : 'Inactivo',
          fechacreacion: area.fechacreacion ? new Date(area.fechacreacion).toLocaleDateString('es-ES') : '-',
          antiguedad: calcularAntiguedad(area.fechacreacion || new Date())
        }));
      break;

    case "antiguas":
      title = "Reporte de Áreas Antiguas";
      columns = timeColumns;
      // Ordenar por fecha de creación (más antiguas primero)
      transformedData = [...data]
        .sort((a, b) => {
          if (!a.fechacreacion) return 1;
          if (!b.fechacreacion) return -1;
          return new Date(a.fechacreacion).getTime() - new Date(b.fechacreacion).getTime();
        })
        .slice(0, 10) // Tomar solo las 10 más antiguas
        .map(area => ({
          ...area,
          activo: area.activo ? 'Activo' : 'Inactivo',
          fechacreacion: area.fechacreacion ? new Date(area.fechacreacion).toLocaleDateString('es-ES') : '-',
          antiguedad: calcularAntiguedad(area.fechacreacion || new Date())
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

export default AreasPDF;