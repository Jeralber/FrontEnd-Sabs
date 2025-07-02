import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

// Tipo de datos a mostrar
type ReportType = "normal" | "activas" | "inactivas" | "porCentro" | "recientes";

interface SedesPDFProps {
  data: Partial<Models['Sede']>[];
  startDate?: string;
  endDate?: string;
  reportType?: ReportType;
}

const SedesPDF: React.FC<SedesPDFProps> = ({ data, startDate, endDate, reportType = "normal" }) => {
  // Columnas para el reporte normal
  const normalColumns = [
    { header: 'ID', accessor: 'idSede', width: '15%' },
    { header: 'Sede', accessor: 'sede', width: '25%' },
    { header: 'Centro', accessor: 'centro.Centro', width: '20%' },
    { header: 'Dirección', accessor: 'Direccion', width: '25%' },
    { header: 'Estado', accessor: 'activo', width: '15%' },
  ];

  // Columnas para reportes especiales
  const specialColumns = [
    { header: 'ID', accessor: 'idSede', width: '15%' },
    { header: 'Sede', accessor: 'sede', width: '35%' },
    { header: 'Centro', accessor: 'centro.Centro', width: '25%' },
    { header: 'Dirección', accessor: 'Direccion', width: '25%' },
  ];

  // Columnas para reporte por centro
  const centroColumns = [
    { header: 'Centro', accessor: 'centro', width: '40%' },
    { header: 'Cantidad de Sedes', accessor: 'cantidad', width: '30%' },
    { header: 'Activas', accessor: 'activas', width: '15%' },
    { header: 'Inactivas', accessor: 'inactivas', width: '15%' },
  ];

  // Transformar los datos según el tipo de reporte
  let transformedData = [];
  let title = "Reporte de Sedes";
  let columns = normalColumns;

  switch (reportType) {
    case "normal":
      // Transformación para reporte normal
      transformedData = data.map(sede => ({
        ...sede,
        activo: sede.activo ? 'Activo' : 'Inactivo'
      }));
      break;

    case "activas":
      title = "Reporte de Sedes Activas";
      columns = specialColumns;
      // Filtrar solo sedes activas
      transformedData = data.filter(sede => sede.activo);
      break;

    case "inactivas":
      title = "Reporte de Sedes Inactivas";
      columns = specialColumns;
      // Filtrar solo sedes inactivas
      transformedData = data.filter(sede => !sede.activo);
      break;

    case "porCentro":
      title = "Reporte de Sedes por Centro";
      columns = centroColumns;
      
      // Crear un mapa para agrupar por centro
      const centroMap = new Map();
      
      data.forEach(sede => {
        if (sede.centroRelation?.centro) {
          const centroNombre = sede.centroRelation?.centro;
          
          if (!centroMap.has(centroNombre)) {
            centroMap.set(centroNombre, {
              centro: centroNombre,
              cantidad: 0,
              activas: 0,
              inactivas: 0
            });
          }
          
          const centroData = centroMap.get(centroNombre);
          centroData.cantidad += 1;
          
          if (sede.activo) {
            centroData.activas += 1;
          } else {
            centroData.inactivas += 1;
          }
        }
      });
      
      // Convertir el mapa a un array para la tabla
      transformedData = Array.from(centroMap.values());
      
      // Ordenar por cantidad (mayor a menor)
      transformedData.sort((a, b) => b.cantidad - a.cantidad);
      break;

    case "recientes":
      title = "Reporte de Sedes Recientes";
      // Ordenar por fecha de creación (más recientes primero)
      transformedData = [...data]
        .sort((a, b) => {
          if (!a.fechacreacion) return 1;
          if (!b.fechacreacion) return -1;
          return new Date(b.fechacreacion).getTime() - new Date(a.fechacreacion).getTime();
        })
        .slice(0, 10) // Tomar solo las 10 más recientes
        .map(sede => ({
          ...sede,
          activo: sede.activo ? 'Activo' : 'Inactivo'
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

export default SedesPDF;