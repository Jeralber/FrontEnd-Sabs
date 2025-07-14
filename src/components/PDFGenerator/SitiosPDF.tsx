import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

// Tipo de datos a mostrar
type ReportType = "normal" | "activos" | "inactivos" | "porTipo" | "recientes";

interface SitiosPDFProps {
  data: Partial<Models['Sitio']>[];
  startDate?: string;
  endDate?: string;
  reportType?: ReportType;
}

const SitiosPDF: React.FC<SitiosPDFProps> = ({ data, startDate, endDate, reportType = "normal" }) => {
  // Columnas para el reporte normal
  const normalColumns = [
    { header: 'ID', accessor: 'idSitio', width: '20%' },
    { header: 'Sitio', accessor: 'sitio', width: '30%' },
    { header: 'Tipo de Sitio', accessor: 'tipositio.TipoSitio', width: '25%' },
    { header: 'Estado', accessor: 'activo', width: '10%' },
    { header: 'Fecha Creación', accessor: 'fechaCreacion', width: '15%' },
  ];

  // Columnas para reportes especiales
  const specialColumns = [
    { header: 'ID', accessor: 'idSitio', width: '20%' },
    { header: 'Sitio', accessor: 'sitio', width: '40%' },
    { header: 'Tipo de Sitio', accessor: 'tipositio.TipoSitio', width: '40%' },
  ];

  // Columnas para reporte por tipo
  const tipoColumns = [
    { header: 'Tipo de Sitio', accessor: 'tipo', width: '40%' },
    { header: 'Cantidad de Sitios', accessor: 'cantidad', width: '30%' },
    { header: 'Activos', accessor: 'activos', width: '15%' },
    { header: 'Inactivos', accessor: 'inactivos', width: '15%' },
  ];

  // Transformar los datos según el tipo de reporte
  let transformedData = [];
  let title = "Reporte de Sitios";
  let columns = normalColumns;

  switch (reportType) {
    case "normal":
      // Transformación para reporte normal
      transformedData = data.map(sitio => ({
        ...sitio,
        activo: sitio.activo ? 'Activo' : 'Inactivo',
        fechaCreacion: sitio.fechacreacion ? new Date(sitio.fechacreacion).toLocaleDateString('es-ES') : '-'
      }));
      break;

    case "activos":
      title = "Reporte de Sitios Activos";
      columns = specialColumns;
      // Filtrar solo sitios activos
      transformedData = data.filter(sitio => sitio.activo);
      break;

    case "inactivos":
      title = "Reporte de Sitios Inactivos";
      columns = specialColumns;
      // Filtrar solo sitios inactivos
      transformedData = data.filter(sitio => !sitio.activo);
      break;

    case "porTipo":
      title = "Reporte de Sitios por Tipo";
      columns = tipoColumns;
      
      // Crear un mapa para agrupar por tipo de sitio
      const tipoMap = new Map();
      
      data.forEach(sitio => {
        if (sitio.tipositionRelation?.tipositio) {
          const tipoNombre = sitio.tipositionRelation?.tipositio;
          
          if (!tipoMap.has(tipoNombre)) {
            tipoMap.set(tipoNombre, {
              tipo: tipoNombre,
              cantidad: 0,
              activos: 0,
              inactivos: 0
            });
          }
          
          const tipoData = tipoMap.get(tipoNombre);
          tipoData.cantidad += 1;
          
          if (sitio.activo) {
            tipoData.activos += 1;
          } else {
            tipoData.inactivos += 1;
          }
        }
      });
      
      // Convertir el mapa a un array para la tabla
      transformedData = Array.from(tipoMap.values());
      
      // Ordenar por cantidad (mayor a menor)
      transformedData.sort((a, b) => b.cantidad - a.cantidad);
      break;

    case "recientes":
      title = "Reporte de Sitios Recientes";
      // Ordenar por fecha de creación (más recientes primero)
      transformedData = [...data]
        .sort((a, b) => {
          if (!a.fechacreacion) return 1;
          if (!b.fechacreacion) return -1;
          return new Date(b.fechacreacion).getTime() - new Date(a.fechacreacion).getTime();
        })
        .slice(0, 10) // Tomar solo los 10 más recientes
        .map(sitio => ({
          ...sitio,
          activo: sitio.activo ? 'Activo' : 'Inactivo',
          fechaCreacion: sitio.fechacreacion ? new Date(sitio.fechacreacion).toLocaleDateString('es-ES') : '-'
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

export default SitiosPDF;