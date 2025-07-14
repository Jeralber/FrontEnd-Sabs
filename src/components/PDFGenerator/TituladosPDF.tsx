import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

// Tipo de datos a mostrar
type ReportType = "normal" | "activos" | "inactivos" | "porArea" | "porFicha";

interface TituladosPDFProps {
  data: Partial<Models['Titulado']>[];
  startDate?: string;
  endDate?: string;
  reportType?: ReportType;
}

const TituladosPDF: React.FC<TituladosPDFProps> = ({ data, startDate, endDate, reportType = "normal" }) => {
  // Columnas para el reporte normal
  const normalColumns = [
    { header: 'ID', accessor: 'idTitulado', width: '15%' },
    { header: 'Titulado', accessor: 'Titulado', width: '25%' },
    { header: 'Área', accessor: 'area.Area', width: '20%' },
    { header: 'Ficha', accessor: 'ficha.numFicha', width: '15%' },
    { header: 'Estado', accessor: 'activo', width: '10%' },
    { header: 'Fecha Creación', accessor: 'fechaCreacion', width: '15%' },
  ];

  // Columnas para reportes especiales
  const specialColumns = [
    { header: 'ID', accessor: 'idTitulado', width: '15%' },
    { header: 'Titulado', accessor: 'Titulado', width: '35%' },
    { header: 'Área', accessor: 'area.Area', width: '25%' },
    { header: 'Ficha', accessor: 'ficha.numFicha', width: '25%' },
  ];

  // Columnas para reporte por área
  const areaColumns = [
    { header: 'Área', accessor: 'area', width: '40%' },
    { header: 'Cantidad de Titulados', accessor: 'cantidad', width: '30%' },
    { header: 'Activos', accessor: 'activos', width: '15%' },
    { header: 'Inactivos', accessor: 'inactivos', width: '15%' },
  ];

  // Columnas para reporte por ficha
  const fichaColumns = [
    { header: 'Ficha', accessor: 'ficha', width: '40%' },
    { header: 'Cantidad de Titulados', accessor: 'cantidad', width: '30%' },
    { header: 'Activos', accessor: 'activos', width: '15%' },
    { header: 'Inactivos', accessor: 'inactivos', width: '15%' },
  ];

  // Transformar los datos según el tipo de reporte
  let transformedData = [];
  let title = "Reporte de Titulados";
  let columns = normalColumns;

  switch (reportType) {
    case "normal":
      // Transformación para reporte normal
      transformedData = data.map(titulado => ({
        ...titulado,
        activo: titulado.activo ? 'Activo' : 'Inactivo',
        fechaCreacion: titulado.fechacreacion ? new Date(titulado.fechacreacion).toLocaleDateString('es-ES') : '-'
      }));
      break;

    case "activos":
      title = "Reporte de Titulados Activos";
      columns = specialColumns;
      // Filtrar solo titulados activos
      transformedData = data.filter(titulado => titulado.activo);
      break;

    case "inactivos":
      title = "Reporte de Titulados Inactivos";
      columns = specialColumns;
      // Filtrar solo titulados inactivos
      transformedData = data.filter(titulado => !titulado.activo);
      break;

    case "porArea":
      title = "Reporte de Titulados por Área";
      columns = areaColumns;
      
      // Crear un mapa para agrupar por área
      const areaMap = new Map();
      
      data.forEach(titulado => {
        if (titulado.areaRelation?.area) {
          const areaNombre = titulado.areaRelation.area;
          
          if (!areaMap.has(areaNombre)) {
            areaMap.set(areaNombre, {
              area: areaNombre,
              cantidad: 0,
              activos: 0,
              inactivos: 0
            });
          }
          
          const areaData = areaMap.get(areaNombre);
          areaData.cantidad += 1;
          
          if (titulado.activo) {
            areaData.activos += 1;
          } else {
            areaData.inactivos += 1;
          }
        }
      });
      
      // Convertir el mapa a un array para la tabla
      transformedData = Array.from(areaMap.values());
      
      // Ordenar por cantidad (mayor a menor)
      transformedData.sort((a, b) => b.cantidad - a.cantidad);
      break;

    case "porFicha":
      title = "Reporte de Titulados por Ficha";
      columns = fichaColumns;
      
      // Crear un mapa para agrupar por ficha
      const fichaMap = new Map();
      
      data.forEach(titulado => {
        if (titulado.fichaRelation?.numficha) {
          const fichaNumero = titulado.fichaRelation?.numficha;
          
          if (!fichaMap.has(fichaNumero)) {
            fichaMap.set(fichaNumero, {
              ficha: fichaNumero,
              cantidad: 0,
              activos: 0,
              inactivos: 0
            });
          }
          
          const fichaData = fichaMap.get(fichaNumero);
          fichaData.cantidad += 1;
          
          if (titulado.activo) {
            fichaData.activos += 1;
          } else {
            fichaData.inactivos += 1;
          }
        }
      });
      
      // Convertir el mapa a un array para la tabla
      transformedData = Array.from(fichaMap.values());
      
      // Ordenar por cantidad (mayor a menor)
      transformedData.sort((a, b) => b.cantidad - a.cantidad);
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

export default TituladosPDF;