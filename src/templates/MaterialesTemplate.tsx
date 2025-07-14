
import { DataTable } from '@/components/Table/DataTable';
import { GenericForm, FieldDefinition } from '@/components/Form/GenericForm';
import { useMaterial } from '@/hooks/Materiales/useMateriales';
import { Material } from '@/services/Materiales/materialesServices';
import { Modal } from '@heroui/react';
import { GenericBarChart } from '@/components/Charts/GenericBarChart';

export const MaterialManager = () => {
  const {
    materiales,
    selectedMaterial,
    loading,
    error,
    isModalOpen,
    tiposMaterial,
    unidadesMedida,
    categoriasMaterial,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
    deleteMaterial,
  } = useMaterial();

  const columns = [
    { 
      accessorKey: 'nombreMaterial' as keyof Material, 
      header: 'Nombre',
      sortable: true 
    },
    { 
      accessorKey: 'descripcion' as keyof Material, 
      header: 'Descripción',
      sortable: true 
    },
    { 
      accessorKey: 'stock' as keyof Material, 
      header: 'Stock',
      sortable: true 
    },
    { 
      accessorKey: 'TipoMaterial' as keyof Material, 
      header: 'Tipo de Material',
      sortable: true,
      cell: (row: any) => {
        const tipoMaterial = tiposMaterial.find(t => t.idtipomaterial === row.TipoMaterial);
        return tipoMaterial ? tipoMaterial.tipo : row.TipoMaterial || 'N/A';
      }
    },
    { 
      accessorKey: 'UnidadMedida' as keyof Material, 
      header: 'Unidad de Medida',
      sortable: true,
      cell: (row: any) => {
        const unidadMedida = unidadesMedida.find(u => u.idunidadmedida === row.UnidadMedida);
        return unidadMedida ? unidadMedida.unidadmedida : row.UnidadMedida || 'N/A';
      }
    },
    { 
      accessorKey: 'CategoriaMaterial' as keyof Material, 
      header: 'Categoría',
      sortable: true,
      cell: (row: any) => {
        const categoria = categoriasMaterial.find(c => c.idcategoriamaterial === row.CategoriaMaterial);
        return categoria ? categoria.categoria : row.CategoriaMaterial || 'N/A';
      }
    },
    { 
      accessorKey: 'Caduca' as keyof Material, 
      header: 'Caduca',
      sortable: true,
      cell: (row: any) => row.Caduca ? 'Sí' : 'No'
    },
    { 
      accessorKey: 'fechaVencimiento' as keyof Material, 
      header: 'Fecha de Vencimiento',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaVencimiento ? new Date(row.fechaVencimiento).toLocaleDateString() : 'N/A'
    },
    { 
      accessorKey: 'activo' as keyof Material, 
      header: 'Estado',
      sortable: true,
      cell: (row: any) => row.activo ? 'Activo' : 'Inactivo'
    },
    { 
      accessorKey: 'fechaCreacion' as keyof Material, 
      header: 'Fecha de Creación',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaCreacion ? new Date(row.fechaCreacion).toLocaleDateString() : 'N/A'
    },
    { 
      accessorKey: 'fechaActualización' as keyof Material, 
      header: 'Fecha de Actualización',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaActualización ? new Date(row.fechaActualización).toLocaleDateString() : 'N/A'
    },
  ];

  const fields: FieldDefinition<Material>[] = [
    { 
      name: 'nombrematerial', 
      label: 'Nombre del Material', 
      required: true, 
      type: 'text' 
    },
    { 
      name: 'descripcion', 
      label: 'Descripción', 
      required: true, 
      type: 'text' 
    },
    { 
      name: 'stock', 
      label: 'Stock', 
      required: true, 
      type: 'number' 
    },
    { 
      name: 'tipomaterial', 
      label: 'Tipo de Material', 
      type: 'select',
      required: true,
      options: tiposMaterial.filter(tipo => tipo.activo).map(tipo => ({
        value: tipo.idtipomaterial,
        label: tipo.tipo
      }))
    },
    { 
    name: 'unidadmedida', 
      label: 'Unidad de Medida', 
      type: 'select',
      required: true,
      options: unidadesMedida.filter(unidad => unidad.activo).map(unidad => ({
        value: unidad.idunidadmedida,
        label: unidad.unidadmedida
      }))
    },
    { 
      name: 'categoriamaterial', 
      label: 'Categoría de Material', 
      type: 'select',
      required: true,
      options: categoriasMaterial.filter(categoria => categoria.activo).map(categoria => ({
        value: categoria.idcategoriamaterial,
        label: categoria.categoria
      }))
    },
    {
      name: 'caduca',
      label: '¿El material caduca?',
      type: 'checkbox',
      required: false
    },
    {
      name: 'fechavencimiento',
      label: 'Fecha de Vencimiento',
      type: 'date',
      required: false
    },
    {
      name: 'activo',
      label: 'Estado',
      type: 'checkbox',
      required: false
    },
  ];

  const handleFormSubmit = async (values: Partial<Material>) => {
    try {
      // Validar campos requeridos
      const requiredFields = ['nombreMaterial', 'descripcion', 'stock', 'TipoMaterial', 'UnidadMedida', 'CategoriaMaterial'];
      const missingFields = requiredFields.filter(field => !values[field as keyof Material]);
      
      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      // Asegurarse de que el stock sea un número positivo
      if (typeof values.stock === 'number' && values.stock < 0) {
        throw new Error('El stock no puede ser negativo');
      }

      // Validar fecha de vencimiento si el material caduca
      if (values.caduca && !values.fechavencimiento) {
        throw new Error('La fecha de vencimiento es requerida para materiales que caducan');
      }

      // Actualizar fecha de actualización si es una edición
      if (selectedMaterial) {
        values.fechaactualización = new Date();
      }

      // Establecer valor por defecto para activo en nuevos registros
      if (!selectedMaterial && values.activo === undefined) {
        values.activo = true;
      }

      return await handleSubmit(values);
    } catch (error) {
      console.error('Error en la validación del formulario:', error);
      throw error;
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
            <div className="mb-8">
        <GenericBarChart
          data={materiales}
          dateField="fechacreacion"
          title="Personas registradas por mes"
        />
      </div>
      <DataTable<Material>
        data={materiales}
        columns={columns}
        title="Gestión de Materiales"
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={deleteMaterial}
        getRowId={(row) => row.idmaterial}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={selectedMaterial ? 'Editar Material' : 'Crear Material'}
          className="max-w-2xl z-50"
        >
          <GenericForm<Material>
            fields={fields}
            initialValues={selectedMaterial || { activo: true, caduca: false }}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};