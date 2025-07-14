import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

interface RolesPDFProps {
  data: Partial<Models['Rol']>[];
  startDate?: string;
  endDate?: string;
}

const RolesPDF: React.FC<RolesPDFProps> = ({ data, startDate, endDate }) => {
  const columns = [
    { header: 'ID', accessor: 'idRol', width: '20%' },
    { header: 'Nombre del Rol', accessor: 'nombreRol', width: '40%' },
    { header: 'Estado', accessor: 'activo', width: '20%' },
    { header: 'Fecha de Creación', accessor: 'fechaCreacion', width: '20%' },
  ];

  // Transformar los datos para mostrar valores legibles
  const transformedData = data.map(rol => ({
    ...rol,
    activo: rol.activo ? 'Activo' : 'Inactivo',
    fechaCreacion: rol.fechacreacion ? new Date(rol.fechacreacion).toLocaleDateString('es-ES') : '-'
  }));

  const dateRange = startDate && endDate 
    ? `Período: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`
    : 'Reporte completo';

  return (
    <PDFBase 
      title="Reporte de Roles" 
      subtitle={dateRange}
    >
      <PDFTable columns={columns} data={transformedData} />
    </PDFBase>
  );
};

export default RolesPDF;