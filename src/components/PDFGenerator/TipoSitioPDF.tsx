import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

interface TipoSitioPDFProps {
  data: Partial<Models['TipoSitio']>[];
  startDate?: string;
  endDate?: string;
}

const TipoSitioPDF: React.FC<TipoSitioPDFProps> = ({ data, startDate, endDate }) => {
  const columns = [
    { header: 'ID', accessor: 'idTipoSitio', width: '20%' },
    { header: 'Tipo de Sitio', accessor: 'TipoSitio', width: '40%' },
    { header: 'Estado', accessor: 'activo', width: '20%' },
    { header: 'Fecha de Creación', accessor: 'fechaCreacion', width: '20%' },
  ];

  // Transformar los datos para mostrar valores legibles
  const transformedData = data.map(tipoSitio => ({
    ...tipoSitio,
    activo: tipoSitio.activo ? 'Activo' : 'Inactivo',
    fechaCreacion: tipoSitio.fechacreacion ? new Date(tipoSitio.fechacreacion).toLocaleDateString('es-ES') : '-'
  }));

  const dateRange = startDate && endDate 
    ? `Período: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`
    : 'Reporte completo';

  return (
    <PDFBase 
      title="Reporte de Tipos de Sitio" 
      subtitle={dateRange}
    >
      <PDFTable columns={columns} data={transformedData} />
    </PDFBase>
  );
};

export default TipoSitioPDF;