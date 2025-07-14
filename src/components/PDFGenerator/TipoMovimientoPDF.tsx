import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

interface TipoMovimientoPDFProps {
  data: Partial<Models['TipoMovimiento']>[];
  startDate?: string;
  endDate?: string;
}

const TipoMovimientoPDF: React.FC<TipoMovimientoPDFProps> = ({ data, startDate, endDate }) => {
  const columns = [
    { header: 'ID', accessor: 'idTipoMovimiento', width: '20%' },
    { header: 'Tipo de Movimiento', accessor: 'tipoMovimiento', width: '40%' },
    { header: 'Estado', accessor: 'activo', width: '20%' },
    { header: 'Fecha de Creación', accessor: 'fechaCreacion', width: '20%' },
  ];

  // Transformar los datos para mostrar valores legibles
  const transformedData = data.map(tipoMovimiento => ({
    ...tipoMovimiento,
    activo: tipoMovimiento.activo ? 'Activo' : 'Inactivo',
    fechaCreacion: tipoMovimiento.fechacreacion ? new Date(tipoMovimiento.fechacreacion).toLocaleDateString('es-ES') : '-'
  }));

  const dateRange = startDate && endDate 
    ? `Período: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`
    : 'Reporte completo';

  return (
    <PDFBase 
      title="Reporte de Tipos de Movimiento" 
      subtitle={dateRange}
    >
      <PDFTable columns={columns} data={transformedData} />
    </PDFBase>
  );
};

export default TipoMovimientoPDF;