import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

interface UnidadMedidaPDFProps {
  data: Partial<Models['UnidadMedida']>[];
  startDate?: string;
  endDate?: string;
}

const UnidadMedidaPDF: React.FC<UnidadMedidaPDFProps> = ({ data, startDate, endDate }) => {
  const columns = [
    { header: 'ID', accessor: 'idUnidadMedida', width: '20%' },
    { header: 'Unidad de Medida', accessor: 'unidadMedida', width: '40%' },
    { header: 'Estado', accessor: 'activo', width: '20%' },
    { header: 'Fecha Creación', accessor: 'fechaCreacion', width: '20%' },
  ];

  // Transformar los datos para mostrar valores legibles
  const transformedData = data.map(unidadMedida => ({
    ...unidadMedida,
    activo: unidadMedida.activo ? 'Activo' : 'Inactivo',
    fechaCreacion: unidadMedida.fechacreacion ? new Date(unidadMedida.fechacreacion).toLocaleDateString('es-ES') : '-'
  }));

  const dateRange = startDate && endDate 
    ? `Período: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`
    : 'Reporte completo';

  return (
    <PDFBase 
      title="Reporte de Unidades de Medida" 
      subtitle={dateRange}
    >
      <PDFTable columns={columns} data={transformedData} />
    </PDFBase>
  );
};

export default UnidadMedidaPDF;