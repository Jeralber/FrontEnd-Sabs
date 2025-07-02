import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

// Tipo de datos a mostrar
type ReportType = "normal" | "activos" | "inactivos" | "porMunicipio" | "recientes";

interface CentrosPDFProps {
  data: Partial<Models['Centro']>[];
  startDate?: string;
  endDate?: string;
  reportType?: ReportType;
}

const CentrosPDF: React.FC<CentrosPDFProps> = ({ data, startDate, endDate, reportType = "normal" }) => {
  // Columnas para el reporte normal
  const normalColumns = [
    { header: 'ID', accessor: 'idCentro', width: '15%' },
    { header: 'Centro', accessor: 'Centro', width: '30%' },
    { header: 'Municipio', accessor: 'municipio.municipio', width: '25%' },
    { header: 'Estado', accessor: 'activo', width: '15%' },
    { header: 'Fecha Creación', accessor: 'fechaCreacion', width: '15%' },
  ];

  // Columnas para reportes especiales
  const specialColumns = [
    { header: 'ID', accessor: 'idCentro', width: '15%' },
    { header: 'Centro', accessor: 'Centro', width: '40%' },
    { header: 'Municipio', accessor: 'municipio.municipio', width: '30%' },
    { header: 'Fecha Creación', accessor: 'fechaCreacion', width: '15%' },
  ];

  // Columnas para reporte por municipio
  const municipioColumns = [
    { header: 'Municipio', accessor: 'municipio', width: '40%' },
    { header: 'Cantidad de Centros', accessor: 'cantidad', width: '30%' },
    { header: 'Activos', accessor: 'activos', width: '15%' },
    { header: 'Inactivos', accessor: 'inactivos', width: '15%' },
  ];

  // Transformar los datos según el tipo de reporte
  let transformedData = [];
  let title = "Reporte de Centros";
  let columns = normalColumns;

  switch (reportType) {
    case "normal":
      // Transformación para reporte normal
      transformedData = data.map(centro => ({
        ...centro,
        activo: centro.activo ? 'Activo' : 'Inactivo',
        fechaCreacion: centro.fechacreacion ? new Date(centro.fechacreacion).toLocaleDateString('es-ES') : '-'
      }));
      break;

    case "activos":
      title = "Reporte de Centros Activos";
      columns = specialColumns;
      // Filtrar solo centros activos
      transformedData = data
        .filter(centro => centro.activo)
        .map(centro => ({
          ...centro,
          fechaCreacion: centro.fechacreacion ? new Date(centro.fechacreacion).toLocaleDateString('es-ES') : '-'
        }));
      break;

    case "inactivos":
      title = "Reporte de Centros Inactivos";
      columns = specialColumns;
      // Filtrar solo centros inactivos
      transformedData = data
        .filter(centro => !centro.activo)
        .map(centro => ({
          ...centro,
          fechaCreacion: centro.fechacreacion ? new Date(centro.fechacreacion).toLocaleDateString('es-ES') : '-'
        }));
      break;

    case "porMunicipio":
      title = "Reporte de Centros por Municipio";
      columns = municipioColumns;
      
      // Crear un mapa para agrupar por municipio
      const municipioMap = new Map();
      
      data.forEach(centro => {
        if (centro.municipio?.toString()) {
          const municipioNombre = centro.municipio?.toString();
          
          if (!municipioMap.has(municipioNombre)) {
            municipioMap.set(municipioNombre, {
              municipio: municipioNombre,
              cantidad: 0,
              activos: 0,
              inactivos: 0
            });
          }
          
          const municipioData = municipioMap.get(municipioNombre);
          municipioData.cantidad += 1;
          
          if (centro.activo) {
            municipioData.activos += 1;
          } else {
            municipioData.inactivos += 1;
          }
        }
      });
      
      // Convertir el mapa a un array para la tabla
      transformedData = Array.from(municipioMap.values());
      
      // Ordenar por cantidad (mayor a menor)
      transformedData.sort((a, b) => b.cantidad - a.cantidad);
      break;

    case "recientes":
      title = "Reporte de Centros Recientes";
      // Ordenar por fecha de creación (más recientes primero)
      transformedData = [...data]
        .sort((a, b) => {
          if (!a.fechacreacion) return 1;
          if (!b.fechacreacion) return -1;
          return new Date(b.fechacreacion).getTime() - new Date(a.fechacreacion).getTime();
        })
        .slice(0, 10) // Tomar solo los 10 más recientes
        .map(centro => ({
          ...centro,
          activo: centro.activo ? 'Activo' : 'Inactivo',
          fechaCreacion: centro.fechacreacion ? new Date(centro.fechacreacion).toLocaleDateString('es-ES') : '-'
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

export default CentrosPDF;