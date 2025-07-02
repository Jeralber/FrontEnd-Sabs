import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

interface AreaCentroPDFProps {
  data: Partial<Models['AreaCentro']>[];
  startDate?: string;
  endDate?: string;
}

const AreaCentroPDF: React.FC<AreaCentroPDFProps> = ({ data, startDate, endDate }) => {
  const columns = [
    { header: 'ID', accessor: 'idAreaCentro', width: '15%' },
    { header: 'Centro', accessor: 'centro.Centro', width: '35%' },
    { header: 'Área', accessor: 'area.Area', width: '35%' },
    { header: 'Estado', accessor: 'activo', width: '15%' },
  ];

  // Transformar los datos para mostrar valores legibles
  const transformedData = data.map(areaCentro => ({
    ...areaCentro,
    activo: areaCentro.activo ? 'Activo' : 'Inactivo',
  }));

  const dateRange = startDate && endDate 
    ? `Período: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`
    : 'Reporte completo';

  return (
    <PDFBase 
      title="Reporte de Áreas por Centro" 
      subtitle={dateRange}
    >
      <PDFTable columns={columns} data={transformedData} />
    </PDFBase>
  );
};

export default AreaCentroPDF;