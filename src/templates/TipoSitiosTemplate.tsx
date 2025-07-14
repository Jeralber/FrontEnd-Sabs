import { DataTable } from '@/components/Table/DataTable';
import { GenericForm, FieldDefinition } from '@/components/Form/GenericForm';
import { useTipoSitio } from '@/hooks/TipoSitios/useTipoSitios';
import { TipoSitio } from '@/services/TipoSitios/tipoSitioService';
import { Modal } from '@heroui/react';
import { GenericBarChart } from '@/components/Charts/GenericBarChart';

export const TipoSitioManager = () => {
  const {
    tipoSitios,
    selectedTipoSitio,
    loading,
    error,
    isModalOpen,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
    deleteTipoSitio,
  } = useTipoSitio();

  // Define columns for the DataTable
  const columns = [
    { 
      accessorKey: 'TipoSitio' as keyof TipoSitio, 
      header: 'Tipo de Sitio',
      sortable: true 
    },
    { 
      accessorKey: 'activo' as keyof TipoSitio, 
      header: 'Estado',
      sortable: true,
      cell: (row: any) => row.activo ? 'Activo' : 'Inactivo'
    },
    { 
      accessorKey: 'fechaCreacion' as keyof TipoSitio, 
      header: 'Fecha de Creación',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaCreacion ? new Date(row.fechaCreacion).toLocaleDateString() : 'N/A'
    },
    { 
      accessorKey: 'fechaActualización' as keyof TipoSitio, 
      header: 'Fecha de Actualización',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaActualización ? new Date(row.fechaActualización).toLocaleDateString() : 'N/A'
    },
  ];

  // Define fields for the GenericForm
  const fields: FieldDefinition<TipoSitio>[] = [
    { name: 'tipositio', label: 'Tipo de Sitio', required: true, type: 'text' },
    {
      name: 'activo',
      label: 'Estado',
      type: 'checkbox',
      required: false
    },
  ];

  // Custom submit handler to handle dates
  const handleFormSubmit = async (values: Partial<TipoSitio>) => {
    // If updating, add the current date as fechaActualización
    if (selectedTipoSitio) {
      values.fechaactualización = new Date();
    }
    // Si no se proporciona un valor para activo en un nuevo registro, establecerlo como true
    if (!selectedTipoSitio && values.activo === undefined) {
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
          data={tipoSitios}
          dateField="fechacreacion"
          title="Personas registradas por mes"
        />
      </div>
      <DataTable<TipoSitio>
        data={tipoSitios}
        columns={columns}
        title="Gestión de Tipos de Sitio"
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={deleteTipoSitio}
        getRowId={(row) => row.idtipositio}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={selectedTipoSitio ? 'Editar Tipo de Sitio' : 'Crear Tipo de Sitio'}
          className="max-w-md z-50"
        >
          <GenericForm<TipoSitio>
            fields={fields}
            initialValues={selectedTipoSitio || { activo: true }}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};