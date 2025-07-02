import { DataTable } from '@/components/Table/DataTable';
import { GenericForm, FieldDefinition } from '@/components/Form/GenericForm';
import { useTipoMovimiento } from '@/hooks/TipoMovimientos/useTipoMovimientos';
import { TipoMovimiento } from '@/services/TipoMovimientos/tipoMovimientoService';
import { Modal } from '@heroui/react';
import { GenericBarChart } from '@/components/Charts/GenericBarChart';

export const TipoMovimientoManager = () => {
  const {
    tipoMovimientos,
    selectedTipoMovimiento,
    loading,
    error,
    isModalOpen,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
    deleteTipoMovimiento,
  } = useTipoMovimiento();

  // Define columns for the DataTable
  const columns = [
    { 
      accessorKey: 'tipoMovimiento' as keyof TipoMovimiento, 
      header: 'Tipo de Movimiento',
      sortable: true 
    },
    { 
      accessorKey: 'activo' as keyof TipoMovimiento, 
      header: 'Estado',
      sortable: true,
      cell: (row: any) => row.activo ? 'Activo' : 'Inactivo'
    },
    { 
      accessorKey: 'fechaCreacion' as keyof TipoMovimiento, 
      header: 'Fecha de Creación',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaCreacion ? new Date(row.fechaCreacion).toLocaleDateString() : 'N/A'
    },
    { 
      accessorKey: 'fechaActualización' as keyof TipoMovimiento, 
      header: 'Fecha de Actualización',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaActualización ? new Date(row.fechaActualización).toLocaleDateString() : 'N/A'
    },
  ];

  // Define fields for the GenericForm
  const fields: FieldDefinition<TipoMovimiento>[] = [
    { name: 'tipomovimiento', label: 'Tipo de Movimiento', required: true, type: 'text' },
    {
      name: 'activo',
      label: 'Estado',
      type: 'checkbox',
      required: false
    },
  ];

  // Custom submit handler to handle dates
  const handleFormSubmit = async (values: Partial<TipoMovimiento>) => {
    // If updating, add the current date as fechaActualización
    if (selectedTipoMovimiento) {
      values.fechaactualización = new Date();
    }
    // Si no se proporciona un valor para activo en un nuevo registro, establecerlo como true
    if (!selectedTipoMovimiento && values.activo === undefined) {
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
          data={tipoMovimientos}
          dateField="fechacreacion"
          title="Personas registradas por mes"
        />
      </div>
      <DataTable<TipoMovimiento>
        data={tipoMovimientos}
        columns={columns}
        title="Gestión de Tipos de Movimiento"
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={deleteTipoMovimiento}
        getRowId={(row) => row.idtipomovimiento}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={selectedTipoMovimiento ? 'Editar Tipo de Movimiento' : 'Crear Tipo de Movimiento'}
          className="max-w-md z-50"
        >
          <GenericForm<TipoMovimiento>
            fields={fields}
            initialValues={selectedTipoMovimiento || { activo: true }}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};