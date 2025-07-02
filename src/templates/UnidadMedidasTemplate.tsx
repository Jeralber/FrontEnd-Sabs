import { DataTable } from '@/components/Table/DataTable';
import { GenericForm, FieldDefinition } from '@/components/Form/GenericForm';
import { useUnidadMedida } from '@/hooks/UnidadMedidas/useUnidadMedidas';
import { UnidadMedida } from '@/services/UnidadMedidas/unidadMedidaService';
import { Modal } from '@heroui/react';
import { GenericBarChart } from '@/components/Charts/GenericBarChart';

export const UnidadMedidaManager = () => {
  const {
    unidadesMedida,
    selectedUnidadMedida,
    loading,
    error,
    isModalOpen,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
    deleteUnidadMedida,
  } = useUnidadMedida();

  // Define columns for the DataTable
  const columns = [
    { 
      accessorKey: 'unidadMedida' as keyof UnidadMedida, 
      header: 'Unidad de Medida',
      sortable: true 
    },
    { 
      accessorKey: 'activo' as keyof UnidadMedida, 
      header: 'Estado',
      sortable: true,
      cell: (row: any) => row.activo ? 'Activo' : 'Inactivo'
    },
    { 
      accessorKey: 'fechaCreacion' as keyof UnidadMedida, 
      header: 'Fecha de Creación',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaCreacion ? new Date(row.fechaCreacion).toLocaleDateString() : 'N/A'
    },
    { 
      accessorKey: 'fechaActualización' as keyof UnidadMedida, 
      header: 'Fecha de Actualización',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaActualización ? new Date(row.fechaActualización).toLocaleDateString() : 'N/A'
    },
  ];

  // Define fields for the GenericForm
  const fields: FieldDefinition<UnidadMedida>[] = [
    { name: 'unidadmedida', label: 'Unidad de Medida', required: true, type: 'text' },
    {
      name: 'activo',
      label: 'Estado',
      type: 'checkbox',
      required: false
    },
  ];

  // Custom submit handler to handle dates
  const handleFormSubmit = async (values: Partial<UnidadMedida>) => {
    // If updating, add the current date as fechaActualización
    if (selectedUnidadMedida) {
      values.fechaactualización = new Date();
    }
    // Si no se proporciona un valor para activo en un nuevo registro, establecerlo como true
    if (!selectedUnidadMedida && values.activo === undefined) {
      values.activo = true;
    }
    return await handleSubmit(values);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
            <div className="mb-8">
        <GenericBarChart
          data={unidadesMedida}
          dateField="fechacreacion"
          title="Personas registradas por mes"
        />
      </div>
      <DataTable<UnidadMedida>
        data={unidadesMedida}
        columns={columns}
        title="Gestión de Unidades de Medida"
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={deleteUnidadMedida}
        getRowId={(row) => row.idunidadmedida}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={selectedUnidadMedida ? 'Editar Unidad de Medida' : 'Crear Unidad de Medida'}
          className="max-w-md z-50"
        >
          <GenericForm<UnidadMedida>
            fields={fields}
            initialValues={selectedUnidadMedida || { activo: true }}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};