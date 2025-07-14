import { DataTable } from '@/components/Table/DataTable';
import { GenericForm, FieldDefinition } from '@/components/Form/GenericForm';
import { useCategoriaMaterial } from '@/hooks/CategoriaMateriales/useCategoriaMateriales';
import { CategoriaMaterial } from '@/services/CategoriaMateriales/categoriaMaterialService';
import { Modal } from '@heroui/react';
import { GenericBarChart } from '@/components/Charts/GenericBarChart';

export const CategoriaMaterialManager = () => {
  const {
    categoriasMaterial,
    selectedCategoriaMaterial,
    loading,
    error,
    isModalOpen,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
    deleteCategoriaMaterial,
  } = useCategoriaMaterial();


  const columns = [
    { 
      accessorKey: 'códigoMaterial' as keyof CategoriaMaterial, 
      header: 'Código',
      sortable: true 
    },
    { 
      accessorKey: 'categoria' as keyof CategoriaMaterial, 
      header: 'Categoría',
      sortable: true 
    },
    { 
      accessorKey: 'activo' as keyof CategoriaMaterial, 
      header: 'Estado',
      sortable: true,
      cell: (row: any) => row.activo ? 'Activo' : 'Inactivo'
    },
    { 
      accessorKey: 'fechaCreacion' as keyof CategoriaMaterial, 
      header: 'Fecha de Creación',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaCreacion ? new Date(row.fechaCreacion).toLocaleDateString() : 'N/A'
    },
    { 
      accessorKey: 'fechaActualización' as keyof CategoriaMaterial, 
      header: 'Fecha de Actualización',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaActualización ? new Date(row.fechaActualización).toLocaleDateString() : 'N/A'
    },
  ];


  const fields: FieldDefinition<CategoriaMaterial>[] = [
    { name: 'códigomaterial', label: 'Código de Material', required: true, type: 'text' },
    { name: 'categoria', label: 'Categoría', required: true, type: 'text' },
    {
      name: 'activo',
      label: 'Estado',
      type: 'checkbox',
      required: false
    },
  ];

 
  const handleFormSubmit = async (values: Partial<CategoriaMaterial>) => {
    if (selectedCategoriaMaterial) {
      values.fechaactualización = new Date();
    }
    // Si no se proporciona un valor para activo en un nuevo registro, establecerlo como true
    if (!selectedCategoriaMaterial && values.activo === undefined) {
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
          data={categoriasMaterial}
          dateField="fechacreacion"
          title="Personas registradas por mes"
        />
      </div>
      <DataTable<CategoriaMaterial>
        data={categoriasMaterial}
        columns={columns}
        title="Gestión de Categorías de Material"
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={deleteCategoriaMaterial}
        getRowId={(row) => row.idcategoriamaterial}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={selectedCategoriaMaterial ? 'Editar Categoría de Material' : 'Crear Categoría de Material'}
          className="max-w-md z-50"
        >
          <GenericForm<CategoriaMaterial>
            fields={fields}
            initialValues={selectedCategoriaMaterial || { activo: true }}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};