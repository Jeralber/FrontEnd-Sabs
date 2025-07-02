
import { DataTable } from '@/components/Table/DataTable';
import { GenericForm, FieldDefinition } from '@/components/Form/GenericForm';
import { useRol } from '@/hooks/Roles/useRoles';
import { Rol } from '@/services/Roles/rolService';
import { Modal } from '@heroui/react';
import { GenericBarChart } from '@/components/Charts/GenericBarChart';

export const RolManager = () => {
  const {
    roles,
    selectedRol,
    loading,
    error,
    isModalOpen,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
    deleteRol,
  } = useRol();

  // Define columns for the DataTable
  const columns = [
    { 
      accessorKey: 'nombreRol' as keyof Rol, 
      header: 'Nombre del Rol',
      sortable: true 
    },
    { 
      accessorKey: 'activo' as keyof Rol, 
      header: 'Estado',
      sortable: true,
      cell: (row: any) => row.activo ? 'Activo' : 'Inactivo'
    },
    { 
      accessorKey: 'fechaCreacion' as keyof Rol, 
      header: 'Fecha de Creación',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaCreacion ? new Date(row.fechaCreacion).toLocaleDateString() : 'N/A'
    },
    { 
      accessorKey: 'fechaActualización' as keyof Rol, 
      header: 'Fecha de Actualización',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaActualización ? new Date(row.fechaActualización).toLocaleDateString() : 'N/A'
    },
  ];

  // Define fields for the GenericForm
  const fields: FieldDefinition<Rol>[] = [
    { name: 'nombrerol', label: 'Nombre del Rol', required: true, type: 'text' },
    {
      name: 'activo',
      label: 'Estado',
      type: 'checkbox',
      required: false
    },
  ];

  const handleFormSubmit = async (values: Partial<Rol>) => {
    if (selectedRol) {
      values.fechaactualización = new Date();
    }
    // Si no se proporciona un valor para activo en un nuevo registro, establecerlo como true
    if (!selectedRol && values.activo === undefined) {
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
          data={roles}
          dateField="fechacreacion"
          title="Personas registradas por mes"
        />
      </div>
      <DataTable<Rol>
        data={roles}
        columns={columns}
        title="Gestión de Roles"
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={deleteRol}
        getRowId={(row) => row.idrol}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={selectedRol ? 'Editar Rol' : 'Crear Rol'}
          className="max-w-2xl z-50"
        >
          <GenericForm<Rol>
            fields={fields}
            initialValues={selectedRol || { activo: true }}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};