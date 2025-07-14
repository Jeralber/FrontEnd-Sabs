
import { DataTable } from '@/components/Table/DataTable';
import { GenericForm, FieldDefinition } from '@/components/Form/GenericForm';
import { useDetalles } from '@/hooks/Detalles/useDetalles';
import { Detalle } from '@/services/Detalles/detallesService';
import { Modal } from '@heroui/react';
import { GenericBarChart } from '@/components/Charts/GenericBarChart';
import { GenericDetallesChart } from '@/components/Charts/GenericDetallesChart';

export const DetallesTemplate = () => {
  const {
    detalles,
    selectedDetalle,
    loading,
    error,
    isModalOpen,
    personas,
    materiales,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
    deleteDetalle,
  } = useDetalles();

  // Define columns for the DataTable
  const columns = [
    { accessorKey: 'iddetalle' as keyof Detalle, header: 'ID', sortable: true },
    { 
      accessorKey: 'material' as keyof Detalle, 
      header: 'Material',
      sortable: true,
      cell: (row: any) => {
        const material = materiales.find(m => m.idmaterial === row.material);
        return material ? material.nombrematerial : row.material || 'N/A';
      }
    },
    { 
      accessorKey: 'cantidasolicitada' as keyof Detalle, 
      header: 'Cantidad', 
      sortable: true 
    },
    { 
      accessorKey: 'descripcion' as keyof Detalle, 
      header: 'Descripción', 
      sortable: true 
    },
    { 
      accessorKey: 'personaencargada' as keyof Detalle, 
      header: 'Encargado',
      sortable: true,
      cell: (row: any) => {
        const persona = personas.find(p => p.idpersona === row.personaencargada);
        return persona ? `${persona.nombre} ${persona.apellido}` : row.personaencargada || 'N/A';
      }
    },
    { 
      accessorKey: 'personasolicita' as keyof Detalle, 
      header: 'Solicitante',
      sortable: true,
      cell: (row: any) => {
        const persona = personas.find(p => p.idpersona === row.personasolicita);
        return persona ? `${persona.nombre} ${persona.apellido}` : row.personasolicita || 'N/A';
      }
    },
    { 
      accessorKey: 'personaaprueba' as keyof Detalle, 
      header: 'Aprobador',
      sortable: true,
      cell: (row: any) => {
        const persona = personas.find(p => p.idpersona === row.personaaprueba);
        return persona ? `${persona.nombre} ${persona.apellido}` : row.personaaprueba || 'N/A';
      }
    },
    { 
      accessorKey: 'activo' as keyof Detalle, 
      header: 'Estado',
      sortable: true,
      cell: (row: any) => row.activo ? 'Activo' : 'Inactivo'
    },
    { 
      accessorKey: 'fechacreacion' as keyof Detalle, 
      header: 'Fecha de Creación',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechacreacion ? new Date(row.fechacreacion).toLocaleDateString() : 'N/A'
    },
    { 
      accessorKey: 'fechaactualización' as keyof Detalle, 
      header: 'Fecha de Actualización',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaactualización ? new Date(row.fechaactualización).toLocaleDateString() : 'N/A'
    },
  ];

  // Define fields for the GenericForm
  const fields: FieldDefinition<Detalle>[] = [
    { 
      name: 'material', 
      label: 'Material', 
      type: 'select',
      required: true,
      options: materiales.filter(material => material.activo).map(material => ({
        value: material.idmaterial,
        label: material.nombrematerial
      }))
    },
    { 
      name: 'cantidasolicitada', 
      label: 'Cantidad Solicitada', 
      required: true, 
      type: 'number' 
    },
    { 
      name: 'descripcion', 
      label: 'Descripción', 
      type: 'text' 
    },
    { 
      name: 'personaencargada', 
      label: 'Persona Encargada', 
      type: 'select',
      required: true,
      options: personas.filter(persona => persona.activo).map(persona => ({
        value: persona.idpersona,
        label: `${persona.nombre} ${persona.apellido}`
      }))
    },
    { 
      name: 'personasolicita', 
      label: 'Persona que Solicita', 
      type: 'select',
      required: true,
      options: personas.filter(persona => persona.activo).map(persona => ({
        value: persona.idpersona,
        label: `${persona.nombre} ${persona.apellido}`
      }))
    },
    { 
      name: 'personaaprueba', 
      label: 'Persona que Aprueba', 
      type: 'select',
      required: true,
      options: personas.filter(persona => persona.activo).map(persona => ({
        value: persona.idpersona,
        label: `${persona.nombre} ${persona.apellido}`
      }))
    },
    {
      name: 'activo',
      label: 'Estado',
      type: 'checkbox',
      required: false
    },
  ];

  const handleFormSubmit = async (values: Partial<Detalle>) => {
    if (selectedDetalle) {
      values.fechaactualización = new Date();
    }
    // Si no se proporciona un valor para activo en un nuevo registro, establecerlo como true
    if (!selectedDetalle && values.activo === undefined) {
      values.activo = true;
    }
    return await handleSubmit(values);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Gráficos */}
      <div className="mb-8">
        <GenericBarChart
          data={detalles}
          dateField="fechacreacion"
          title="Detalles registrados por mes"
        />
      </div>
      
      <div className="mb-8">
        <GenericDetallesChart
          detalles={detalles}
          title="Estadísticas de Personas en Detalles"
        />
      </div>

      {/* DataTable */}
      <DataTable
        data={detalles}
        columns={columns}
        title="Gestión de Detalles"
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={deleteDetalle}
        getRowId={(row) => row.iddetalle}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={selectedDetalle ? 'Editar Detalle' : 'Crear Detalle'}
          className="max-w-2xl z-50"
        >
          <GenericForm<Detalle>
            fields={fields}
            initialValues={selectedDetalle || { activo: true }}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};