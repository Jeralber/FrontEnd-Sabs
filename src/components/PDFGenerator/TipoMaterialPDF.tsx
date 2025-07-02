import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

interface TipoMaterialPDFProps {
  data: Partial<Models['TipoMaterial']>[];
  startDate?: string;
  endDate?: string;
}

const TipoMaterialPDF: React.FC<TipoMaterialPDFProps> = ({ data, startDate, endDate }) => {
  const columns = [
    { header: 'ID', accessor: 'idTipoMaterial', width: '20%' },
    { header: 'Tipo', accessor: 'Tipo', width: '40%' },
    { header: 'Estado', accessor: 'activo', width: '20%' },
    { header: 'Fecha de Creación', accessor: 'fechaCreacion', width: '20%' },
  ];

  // Transformar los datos para mostrar valores legibles
  const transformedData = data.map(tipo => ({
    ...tipo,
    activo: tipo.activo ? 'Activo' : 'Inactivo',
    fechaCreacion: tipo.fechacreacion ? new Date(tipo.fechacreacion).toLocaleDateString('es-ES') : '-'
  }));

  const dateRange = startDate && endDate 
    ? `Período: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`
    : 'Reporte completo';

  return (
    <PDFBase 
      title="Reporte de Tipos de Material" 
      subtitle={dateRange}
    >
      <PDFTable columns={columns} data={transformedData} />
    </PDFBase>
  );
};

export default TipoMaterialPDF;