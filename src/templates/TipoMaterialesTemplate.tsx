import { DataTable } from '@/components/Table/DataTable';
import { GenericForm, FieldDefinition } from '@/components/Form/GenericForm';
import { useTipoMaterial } from '@/hooks/TipoMateriales/useTipoMateriales';
import { TipoMaterial } from '@/services/TipoMateriales/tipoMaterialService';
import { Modal } from '@heroui/react';
import { GenericBarChart } from '@/components/Charts/GenericBarChart';

export const TipoMaterialManager = () => {
  const {
    tiposMaterial,
    selectedTipoMaterial,
    loading,
    error,
    isModalOpen,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
    deleteTipoMaterial,
  } = useTipoMaterial();

  // Define columns for the DataTable
  const columns = [
    { 
      accessorKey: 'Tipo' as keyof TipoMaterial, 
      header: 'Tipo de Material',
      sortable: true 
    },
    { 
      accessorKey: 'activo' as keyof TipoMaterial, 
      header: 'Estado',
      sortable: true,
      cell: (row: any) => row.activo ? 'Activo' : 'Inactivo'
    },
    { 
      accessorKey: 'fechaCreacion' as keyof TipoMaterial, 
      header: 'Fecha de Creación',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaCreacion ? new Date(row.fechaCreacion).toLocaleDateString() : 'N/A'
    },
    { 
      accessorKey: 'fechaActualización' as keyof TipoMaterial, 
      header: 'Fecha de Actualización',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaActualización ? new Date(row.fechaActualización).toLocaleDateString() : 'N/A'
    },
  ];

  // Define fields for the GenericForm
  const fields: FieldDefinition<TipoMaterial>[] = [
    { name: 'tipo', label: 'Tipo de Material', required: true, type: 'text' },
    {
      name: 'activo',
      label: 'Estado',
      type: 'checkbox',
      required: false
    },
  ];

  // Custom submit handler to handle dates
  const handleFormSubmit = async (values: Partial<TipoMaterial>) => {
    // If updating, add the current date as fechaActualización
    if (selectedTipoMaterial) {
      values.fechaactualización = new Date();
    }
    // Si no se proporciona un valor para activo en un nuevo registro, establecerlo como true
    if (!selectedTipoMaterial && values.activo === undefined) {
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
          data={tiposMaterial}
          dateField="fechacreacion"
          title="Personas registradas por mes"
        />
      </div>
      <DataTable<TipoMaterial>
        data={tiposMaterial}
        columns={columns}
        title="Gestión de Tipos de Material"
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={deleteTipoMaterial}
        getRowId={(row) => row.idtipomaterial}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={selectedTipoMaterial ? 'Editar Tipo de Material' : 'Crear Tipo de Material'}
          className="max-w-md z-50"
        >
          <GenericForm<TipoMaterial>
            fields={fields}
            initialValues={selectedTipoMaterial || { activo: true }}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};