import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

// Tipo de datos a mostrar
type ReportType = "normal" | "activos" | "inactivos" | "recientes";

interface MunicipioPDFProps {
  data: Partial<Models['Municipio']>[];
  startDate?: string;
  endDate?: string;
  reportType?: ReportType;
}

const MunicipioPDF: React.FC<MunicipioPDFProps> = ({ data, startDate, endDate, reportType = "normal" }) => {
  // Columnas para el reporte normal
  const normalColumns = [
    { header: 'ID', accessor: 'idMunicipio', width: '20%' },
    { header: 'Municipio', accessor: 'municipio', width: '40%' },
    { header: 'Estado', accessor: 'activo', width: '20%' },
    { header: 'Fecha de Creación', accessor: 'fechaCreacion', width: '20%' },
  ];

  // Columnas para reportes especiales
  const specialColumns = [
    { header: 'ID', accessor: 'idMunicipio', width: '20%' },
    { header: 'Municipio', accessor: 'municipio', width: '60%' },
    { header: 'Fecha de Creación', accessor: 'fechaCreacion', width: '20%' },
  ];

  // Transformar los datos según el tipo de reporte
  let transformedData = [];
  let title = "Reporte de Municipios";
  let columns = normalColumns;

  switch (reportType) {
    case "normal":
      // Transformación para reporte normal
      transformedData = data.map(municipio => ({
        ...municipio,
        activo: municipio.activo ? 'Activo' : 'Inactivo',
        fechaCreacion: municipio.fechacreacion ? new Date(municipio.fechacreacion).toLocaleDateString('es-ES') : '-'
      }));
      break;

    case "activos":
      title = "Reporte de Municipios Activos";
      columns = specialColumns;
      // Filtrar solo municipios activos
      transformedData = data
        .filter(municipio => municipio.activo)
        .map(municipio => ({
          ...municipio,
          fechaCreacion: municipio.fechacreacion ? new Date(municipio.fechacreacion).toLocaleDateString('es-ES') : '-'
        }));
      break;

    case "inactivos":
      title = "Reporte de Municipios Inactivos";
      columns = specialColumns;
      // Filtrar solo municipios inactivos
      transformedData = data
        .filter(municipio => !municipio.activo)
        .map(municipio => ({
          ...municipio,
          fechaCreacion: municipio.fechacreacion ? new Date(municipio.fechacreacion).toLocaleDateString('es-ES') : '-'
        }));
      break;

    case "recientes":
      title = "Reporte de Municipios Recientes";
      // Ordenar por fecha de creación (más recientes primero)
      transformedData = [...data]
        .sort((a, b) => {
          if (!a.fechacreacion) return 1;
          if (!b.fechacreacion) return -1;
          return new Date(b.fechacreacion).getTime() - new Date(a.fechacreacion).getTime();
        })
        .slice(0, 10) // Tomar solo los 10 más recientes
        .map(municipio => ({
          ...municipio,
          activo: municipio.activo ? 'Activo' : 'Inactivo',
          fechaCreacion: municipio.fechacreacion ? new Date(municipio.fechacreacion).toLocaleDateString('es-ES') : '-'
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

export default MunicipioPDF;