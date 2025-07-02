import { DataTable } from '@/components/Table/DataTable';
import { GenericForm, FieldDefinition } from '@/components/Form/GenericForm';
import { useMunicipio } from '@/hooks/Municipios/useMunicipios';
import { Municipio } from '@/services/Municipios/municipioService';
import { Modal } from '@heroui/react';
import { GenericBarChart } from '@/components/Charts/GenericBarChart';

export const MunicipioManager = () => {
  const {
    municipios,
    selectedMunicipio,
    loading,
    error,
    isModalOpen,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
    deleteMunicipio,
  } = useMunicipio();

  // Define columns for the DataTable
  const columns = [
    { 
      accessorKey: 'municipio' as keyof Municipio, 
      header: 'Municipio',
      sortable: true 
    },
    { 
      accessorKey: 'activo' as keyof Municipio, 
      header: 'Estado',
      sortable: true,
      cell: (row: any) => row.activo ? 'Activo' : 'Inactivo'
    },
    { 
      accessorKey: 'fechaCreacion' as keyof Municipio, 
      header: 'Fecha de Creación',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaCreacion ? new Date(row.fechaCreacion).toLocaleDateString() : 'N/A'
    },
    { 
      accessorKey: 'fechaActualización' as keyof Municipio, 
      header: 'Fecha de Actualización',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaActualización ? new Date(row.fechaActualización).toLocaleDateString() : 'N/A'
    },
  ];

  // Define fields for the GenericForm
  const fields: FieldDefinition<Municipio>[] = [
    { name: 'municipio', label: 'Nombre del Municipio', required: true, type: 'text' },
    {
      name: 'activo',
      label: 'Estado',
      type: 'checkbox',
      required: false
    },
  ];

  // Custom submit handler to handle dates
  const handleFormSubmit = async (values: Partial<Municipio>) => {
    // If updating, add the current date as fechaActualización
    if (selectedMunicipio) {
      values.fechaactualización = new Date();
    }
    // Si no se proporciona un valor para activo en un nuevo registro, establecerlo como true
    if (!selectedMunicipio && values.activo === undefined) {
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
          data={municipios}
          dateField="fechacreacion"
          title="Personas registradas por mes"
        />
      </div>
      <DataTable<Municipio>
        data={municipios}
        columns={columns}
        title="Gestión de Municipios"
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={deleteMunicipio}
        getRowId={(row) => row.idmunicipio}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={selectedMunicipio ? 'Editar Municipio' : 'Crear Municipio'}
          className="max-w-md z-50"
        >
          <GenericForm<Municipio>
            fields={fields}
            initialValues={selectedMunicipio || { activo: true }}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};