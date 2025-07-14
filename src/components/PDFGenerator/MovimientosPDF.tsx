import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

// Tipo de datos a mostrar
type ReportType = "normal" | "activos" | "inactivos" | "porTipo" | "recientes";

interface MovimientosPDFProps {
  data: Partial<Models['Movimiento']>[];
  startDate?: string;
  endDate?: string;
  reportType?: ReportType;
}

const MovimientosPDF: React.FC<MovimientosPDFProps> = ({ data, startDate, endDate, reportType = "normal" }) => {
  // Columnas para el reporte normal
  const normalColumns = [
    { header: 'ID', accessor: 'idMovimiento', width: '15%' },
    { header: 'Tipo de Movimiento', accessor: 'tipomovimiento.tipoMovimiento', width: '25%' },
    { header: 'Persona', accessor: 'personaNombre', width: '25%' },
    { header: 'Estado', accessor: 'activo', width: '15%' },
    { header: 'Fecha Creación', accessor: 'fechaCreacion', width: '20%' },
  ];

  // Columnas para reportes especiales
  const specialColumns = [
    { header: 'ID', accessor: 'idMovimiento', width: '15%' },
    { header: 'Tipo de Movimiento', accessor: 'tipomovimiento.tipoMovimiento', width: '35%' },
    { header: 'Persona', accessor: 'personaNombre', width: '35%' },
    { header: 'Fecha', accessor: 'fechaCreacion', width: '15%' },
  ];

  // Columnas para reporte por tipo
  const tipoColumns = [
    { header: 'Tipo de Movimiento', accessor: 'tipo', width: '40%' },
    { header: 'Cantidad de Movimientos', accessor: 'cantidad', width: '30%' },
    { header: 'Activos', accessor: 'activos', width: '15%' },
    { header: 'Inactivos', accessor: 'inactivos', width: '15%' },
  ];

  // Transformar los datos según el tipo de reporte
  let transformedData = [];
  let title = "Reporte de Movimientos";
  let columns = normalColumns;

  switch (reportType) {
    case "normal":
      // Transformación para reporte normal
      transformedData = data.map(movimiento => {
        const personaNombre = movimiento.movimientopersona ? 
          `${movimiento.movimientopersonaRelation?.nombre || ''} ${movimiento.movimientopersonaRelation?.apellido || ''}` : 
          '-';
        
        return {
          ...movimiento,
          activo: movimiento.activo ? 'Activo' : 'Inactivo',
          fechaCreacion: movimiento.fechacreacion ? new Date(movimiento.fechacreacion).toLocaleDateString('es-ES') : '-',
          personaNombre
        };
      });
      break;

    case "activos":
      title = "Reporte de Movimientos Activos";
      columns = specialColumns;
      // Filtrar solo movimientos activos
      transformedData = data
        .filter(movimiento => movimiento.activo)
        .map(movimiento => {
          const personaNombre = movimiento.movimientopersona ? 
            `${movimiento.movimientopersonaRelation?.nombre || ''} ${movimiento.movimientopersonaRelation?.apellido || ''}` : 
            '-';
          
          return {
            ...movimiento,
            fechaCreacion: movimiento.fechacreacion ? new Date(movimiento.fechacreacion).toLocaleDateString('es-ES') : '-',
            personaNombre
          };
        });
      break;

    case "inactivos":
      title = "Reporte de Movimientos Inactivos";
      columns = specialColumns;
      // Filtrar solo movimientos inactivos
      transformedData = data
        .filter(movimiento => !movimiento.activo)
        .map(movimiento => {
          const personaNombre = movimiento.movimientopersona ? 
            `${movimiento.movimientopersonaRelation?.nombre || ''} ${movimiento.movimientopersonaRelation?.apellido || ''}` : 
            '-';
          
          return {
            ...movimiento,
            fechaCreacion: movimiento.fechacreacion ? new Date(movimiento.fechacreacion).toLocaleDateString('es-ES') : '-',
            personaNombre
          };
        });
      break;

    case "porTipo":
      title = "Reporte de Movimientos por Tipo";
      columns = tipoColumns;
      
      // Crear un mapa para agrupar por tipo de movimiento
      const tipoMap = new Map();
      
      data.forEach(movimiento => {
        if (movimiento.tipomovimientoRelation?.tipomovimiento) {
          const tipoNombre = movimiento.tipomovimientoRelation?.tipomovimiento;
          
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
          
          if (movimiento.activo) {
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
      title = "Reporte de Movimientos Recientes";
      // Ordenar por fecha de creación (más recientes primero)
      transformedData = [...data]
        .sort((a, b) => {
          if (!a.fechacreacion) return 1;
          if (!b.fechacreacion) return -1;
          return new Date(b.fechacreacion).getTime() - new Date(a.fechacreacion).getTime();
        })
        .slice(0, 10) // Tomar solo los 10 más recientes
        .map(movimiento => {
          const personaNombre = movimiento.movimientopersona ? 
            `${movimiento.movimientopersonaRelation?.nombre || ''} ${movimiento.movimientopersonaRelation?.apellido || ''}` : 
            '-';
          
          return {
            ...movimiento,
            activo: movimiento.activo ? 'Activo' : 'Inactivo',
            fechaCreacion: movimiento.fechacreacion ? new Date(movimiento.fechacreacion).toLocaleDateString('es-ES') : '-',
            personaNombre
          };
        });
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

export default MovimientosPDF;