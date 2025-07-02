import React from 'react';
import PDFBase from './PDFBase';
import PDFTable from './PDFTable';
import { Models } from '../../types/types';

// Tipo de datos a mostrar
type ReportType = "normal" | "activas" | "inactivas" | "porRol" | "recientes";

interface PersonasPDFProps {
  data: Partial<Models['Persona']>[];
  startDate?: string;
  endDate?: string;
  reportType?: ReportType;
}

const PersonasPDF: React.FC<PersonasPDFProps> = ({ data, startDate, endDate, reportType = "normal" }) => {
  // Columnas para el reporte normal
  const normalColumns = [
    { header: 'ID', accessor: 'idPersona', width: '10%' },
    { header: 'Identificación', accessor: 'identificacion', width: '15%' },
    { header: 'Nombre', accessor: 'nombre', width: '15%' },
    { header: 'Apellido', accessor: 'apellido', width: '15%' },
    { header: 'Correo', accessor: 'correo', width: '20%' },
    { header: 'Teléfono', accessor: 'telefono', width: '15%' },
    { header: 'Estado', accessor: 'activo', width: '10%' },
  ];

  // Columnas para reportes especiales
  const specialColumns = [
    { header: 'ID', accessor: 'idPersona', width: '10%' },
    { header: 'Identificación', accessor: 'identificacion', width: '15%' },
    { header: 'Nombre Completo', accessor: 'nombreCompleto', width: '25%' },
    { header: 'Correo', accessor: 'correo', width: '25%' },
    { header: 'Teléfono', accessor: 'telefono', width: '15%' },
  ];

  // Columnas para reporte por rol
  const rolColumns = [
    { header: 'Rol', accessor: 'rol', width: '40%' },
    { header: 'Cantidad de Personas', accessor: 'cantidad', width: '30%' },
    { header: 'Activas', accessor: 'activas', width: '15%' },
    { header: 'Inactivas', accessor: 'inactivas', width: '15%' },
  ];

  // Transformar los datos según el tipo de reporte
  let transformedData = [];
  let title = "Reporte de Personas";
  let columns = normalColumns;

  switch (reportType) {
    case "normal":
      // Transformación para reporte normal
      transformedData = data.map(persona => ({
        ...persona,
        activo: persona.activo ? 'Activo' : 'Inactivo'
      }));
      break;

    case "activas":
      title = "Reporte de Personas Activas";
      columns = specialColumns;
      // Filtrar solo personas activas
      transformedData = data
        .filter(persona => persona.activo)
        .map(persona => ({
          ...persona,
          nombreCompleto: `${persona.nombre || ''} ${persona.apellido || ''}`
        }));
      break;

    case "inactivas":
      title = "Reporte de Personas Inactivas";
      columns = specialColumns;
      // Filtrar solo personas inactivas
      transformedData = data
        .filter(persona => !persona.activo)
        .map(persona => ({
          ...persona,
          nombreCompleto: `${persona.nombre || ''} ${persona.apellido || ''}`
        }));
      break;

    case "porRol":
      title = "Reporte de Personas por Rol";
      columns = rolColumns;
      
      // Crear un mapa para agrupar por rol
      const rolMap = new Map();
      
      // Definir roles comunes (puedes ajustar según tu aplicación)
      const roles = [
        { id: 1, nombre: 'Administrador' },
        { id: 2, nombre: 'Solicitante' },
        { id: 3, nombre: 'Encargado' },
        { id: 4, nombre: 'Aprobador' },
        { id: 5, nombre: 'Usuario Regular' }
      ];
      
      // Inicializar contadores para cada rol
      roles.forEach(rol => {
        rolMap.set(rol.nombre, {
          rol: rol.nombre,
          cantidad: 0,
          activas: 0,
          inactivas: 0
        });
      });
      
      // Contar personas por rol
      data.forEach(persona => {
        // Aquí deberías adaptar la lógica según cómo se almacenan los roles en tu aplicación
        // Este es un ejemplo, asumiendo que hay un campo 'rol' o similar
        const rolNombre = persona.rolRelation?.nombrerol || 'Sin Rol Asignado';
        
        if (!rolMap.has(rolNombre)) {
          rolMap.set(rolNombre, {
            rol: rolNombre,
            cantidad: 0,
            activas: 0,
            inactivas: 0
          });
        }
        
        const rolData = rolMap.get(rolNombre);
        rolData.cantidad += 1;
        
        if (persona.activo) {
          rolData.activas += 1;
        } else {
          rolData.inactivas += 1;
        }
      });
      
      // Convertir el mapa a un array para la tabla
      transformedData = Array.from(rolMap.values());
      
      // Filtrar roles que tienen al menos una persona
      transformedData = transformedData.filter(rol => rol.cantidad > 0);
      
      // Ordenar por cantidad (mayor a menor)
      transformedData.sort((a, b) => b.cantidad - a.cantidad);
      break;

    case "recientes":
      title = "Reporte de Personas Recientes";
      // Ordenar por fecha de creación (más recientes primero)
      transformedData = [...data]
        .sort((a, b) => {
          if (!a.fechacreacion) return 1;
          if (!b.fechacreacion) return -1;
          return new Date(b.fechacreacion).getTime() - new Date(a.fechacreacion).getTime();
        })
        .slice(0, 10) // Tomar solo las 10 más recientes
        .map(persona => ({
          ...persona,
          activo: persona.activo ? 'Activo' : 'Inactivo',
          nombreCompleto: `${persona.nombre || ''} ${persona.apellido || ''}`
        }));
      
      // Usar columnas especiales para este reporte
      columns = [
        ...specialColumns,
        { header: 'Fecha Creación', accessor: 'fechaCreacion', width: '15%' }
      ];
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

export default PersonasPDF;