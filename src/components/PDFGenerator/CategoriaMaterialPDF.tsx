import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

interface CategoriaMaterialPDFProps {
  data: Partial<Models['CategoriaMaterial']>[];
  startDate?: string;
  endDate?: string;
}

const CategoriaMaterialPDF: React.FC<CategoriaMaterialPDFProps> = ({ data, startDate, endDate }) => {
  const columns = [
    { header: 'ID', accessor: 'idCategoriaMaterial', width: '15%' },
    { header: 'Código', accessor: 'códigoMaterial', width: '20%' },
    { header: 'Categoría', accessor: 'categoria', width: '35%' },
    { header: 'Estado', accessor: 'activo', width: '15%' },
    { header: 'Fecha de Creación', accessor: 'fechaCreacion', width: '15%' },
  ];

  // Transformar los datos para mostrar valores legibles
  const transformedData = data.map(categoria => ({
    ...categoria,
    activo: categoria.activo ? 'Activo' : 'Inactivo',
    fechaCreacion: categoria.fechacreacion ? new Date(categoria.fechacreacion).toLocaleDateString('es-ES') : '-'
  }));

  const dateRange = startDate && endDate 
    ? `Período: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`
    : 'Reporte completo';

  return (
    <PDFBase 
      title="Reporte de Categorías de Material" 
      subtitle={dateRange}
    >
      <PDFTable columns={columns} data={transformedData} />
    </PDFBase>
  );
};

export default CategoriaMaterialPDF;