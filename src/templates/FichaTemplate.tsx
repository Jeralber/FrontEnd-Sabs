
import { DataTable } from '@/components/Table/DataTable';
import { GenericForm, FieldDefinition } from '@/components/Form/GenericForm';
import { useFicha } from '@/hooks/Fichas/useFichas';
import { Ficha } from '@/services/Fichas/fichaService';
import { Modal } from '@heroui/react';
import { GenericBarChart } from '@/components/Charts/GenericBarChart';

export const FichaManager = () => {
  const {
    fichas,
    selectedFicha,
    loading,
    error,
    isModalOpen,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
    deleteFicha,
  } = useFicha();


  const columns = [
    { 
      accessorKey: 'numFicha' as keyof Ficha, 
      header: 'Número de Ficha',
      sortable: true 
    },
    { 
      accessorKey: 'cantidadAprendices' as keyof Ficha, 
      header: 'Cantidad de Aprendices',
      sortable: true 
    },
    { 
      accessorKey: 'activo' as keyof Ficha, 
      header: 'Estado',
      sortable: true,
      cell: (row: any) => row.activo ? 'Activo' : 'Inactivo'
    },
    { 
      accessorKey: 'fechaCreacion' as keyof Ficha, 
      header: 'Fecha de Creación',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaCreacion ? new Date(row.fechaCreacion).toLocaleDateString() : 'N/A'
    },
    { 
      accessorKey: 'fechaActualización' as keyof Ficha, 
      header: 'Fecha de Actualización',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaActualización ? new Date(row.fechaActualización).toLocaleDateString() : 'N/A'
    },
  ];


  const fields: FieldDefinition<Ficha>[] = [
    { name: 'numficha', label: 'Número de Ficha', required: true, type: 'number' },
    { name: 'cantidadaprendices', label: 'Cantidad de Aprendices', type: 'number' },
    {
      name: 'activo',
      label: 'Estado',
      type: 'checkbox',
      required: false
    },
  ];

  const handleFormSubmit = async (values: Partial<Ficha>) => {
    if (selectedFicha) {
      values.fechaactualización = new Date();
    }
    // Si no se proporciona un valor para activo en un nuevo registro, establecerlo como true
    if (!selectedFicha && values.activo === undefined) {
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
          data={fichas}
          dateField="fechacreacion"
          title="Personas registradas por mes"
        />
      </div>
      <DataTable<Ficha>
        data={fichas}
        columns={columns}
        title="Gestión de Fichas"
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={deleteFicha}
        getRowId={(row) => row.idficha}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={selectedFicha ? 'Editar Ficha' : 'Crear Ficha'}
          className="max-w-2xl z-50"
        >
          <GenericForm<Ficha>
            fields={fields}
            initialValues={selectedFicha || { activo: true }}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};