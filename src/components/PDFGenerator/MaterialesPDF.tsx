import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

// Tipo de datos a mostrar
type ReportType = "normal" | "conStock" | "sinStock" | "porTipo" | "caducables";

interface MaterialesPDFProps {
  data: Partial<Models['Material']>[];
  startDate?: string;
  endDate?: string;
  reportType?: ReportType;
}

const MaterialesPDF: React.FC<MaterialesPDFProps> = ({ data, startDate, endDate, reportType = "normal" }) => {
  // Columnas para el reporte normal
  const normalColumns = [
    { header: 'ID', accessor: 'idMaterial', width: '10%' },
    { header: 'Nombre', accessor: 'nombreMaterial', width: '20%' },
    { header: 'Descripción', accessor: 'descripcion', width: '20%' },
    { header: 'Stock', accessor: 'stock', width: '10%' },
    { header: 'Tipo', accessor: 'tipoMaterial.Tipo', width: '15%' },
    { header: 'Unidad', accessor: 'unidadMedida.unidadMedida', width: '15%' },
    { header: 'Caduca', accessor: 'Caduca', width: '10%' },
  ];

  // Columnas para reportes especiales
  const specialColumns = [
    { header: 'ID', accessor: 'idMaterial', width: '10%' },
    { header: 'Nombre', accessor: 'nombreMaterial', width: '25%' },
    { header: 'Stock', accessor: 'stock', width: '15%' },
    { header: 'Tipo', accessor: 'tipoMaterial.Tipo', width: '25%' },
    { header: 'Unidad', accessor: 'unidadMedida.unidadMedida', width: '25%' },
  ];

  // Columnas para reporte por tipo
  const tipoColumns = [
    { header: 'Tipo de Material', accessor: 'tipo', width: '40%' },
    { header: 'Cantidad de Materiales', accessor: 'cantidad', width: '20%' },
    { header: 'Stock Total', accessor: 'stockTotal', width: '20%' },
    { header: 'Stock Promedio', accessor: 'stockPromedio', width: '20%' },
  ];

  // Transformar los datos según el tipo de reporte
  let transformedData = [];
  let title = "Reporte de Materiales";
  let columns = normalColumns;

  switch (reportType) {
    case "normal":
      // Transformación para reporte normal
      transformedData = data.map(material => ({
        ...material,
        Caduca: material.caduca ? 'Sí' : 'No'
      }));
      break;

    case "conStock":
      title = "Reporte de Materiales con Stock";
      columns = specialColumns;
      // Filtrar solo materiales con stock
      transformedData = data
        .filter(material => material.stock && material.stock > 0)
        .map(material => ({
          ...material,
          Caduca: material.caduca ? 'Sí' : 'No'
        }));
      break;

    case "sinStock":
      title = "Reporte de Materiales sin Stock";
      columns = specialColumns;
      // Filtrar solo materiales sin stock
      transformedData = data
        .filter(material => !material.stock || material.stock === 0)
        .map(material => ({
          ...material,
          Caduca: material.caduca ? 'Sí' : 'No'
        }));
      break;

    case "porTipo":
      title = "Reporte de Materiales por Tipo";
      columns = tipoColumns;
      
      // Crear un mapa para agrupar por tipo de material
      const tipoMap = new Map();
      
      data.forEach(material => {
        if (material.tipomaterial) {
          const tipoNombre = material.tipomaterial;
          
          if (!tipoMap.has(tipoNombre)) {
            tipoMap.set(tipoNombre, {
              tipo: tipoNombre,
              cantidad: 0,
              stockTotal: 0,
              stockPromedio: 0
            });
          }
          
          const tipoData = tipoMap.get(tipoNombre);
          tipoData.cantidad += 1;
          tipoData.stockTotal += material.stock || 0;
        }
      });
      
      // Calcular promedios y convertir el mapa a un array para la tabla
      transformedData = Array.from(tipoMap.values()).map(tipo => ({
        ...tipo,
        stockPromedio: tipo.cantidad > 0 ? Math.round((tipo.stockTotal / tipo.cantidad) * 100) / 100 : 0
      }));
      
      // Ordenar por cantidad (mayor a menor)
      transformedData.sort((a, b) => b.cantidad - a.cantidad);
      break;

    case "caducables":
      title = "Reporte de Materiales Caducables";
      // Filtrar solo materiales que pueden caducar
      transformedData = data
        .filter(material => material.caduca)
        .map(material => ({
          ...material,
          Caduca: 'Sí'
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

export default MaterialesPDF;