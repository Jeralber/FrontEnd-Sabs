import { DataTable } from '@/components/Table/DataTable';
import { GenericForm, FieldDefinition } from '@/components/Form/GenericForm';
import { useTitulado } from '@/hooks/Titulados/useTitulados';
import { Titulado } from '@/services/Titulados/tituladoService';
import { Modal } from '@heroui/react';
import { GenericTituladosChart } from '@/components/Charts/GenericTituladosChart';

export const TituladoManager = () => {
  const {
    titulados,
    selectedTitulado,
    loading,
    error,
    isModalOpen,
    areas,
    fichas,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
    deleteTitulado,
  } = useTitulado();

  // Define columns for the DataTable
  const columns = [
    { 
      accessorKey: 'Titulado' as keyof Titulado, 
      header: 'Titulado',
      sortable: true 
    },
    { 
      accessorKey: 'Area' as keyof Titulado, 
      header: 'Área',
      sortable: true,
      cell: (row: any) => {
        const area = areas.find(a => a.idarea === row.Area);
        return area ? area.area : row.Area || 'N/A';
      }
    },
    { 
      accessorKey: 'Ficha' as keyof Titulado, 
      header: 'Ficha',
      sortable: true,
      cell: (row: any) => {
        const ficha = fichas.find(f => f.idficha === row.Ficha);
        return ficha ? ficha.numficha.toString() : row.Ficha || 'N/A';
      }
    },
    { 
      accessorKey: 'activo' as keyof Titulado, 
      header: 'Estado',
      sortable: true,
      cell: (row: any) => row.activo ? 'Activo' : 'Inactivo'
    },
    { 
      accessorKey: 'fechaCreacion' as keyof Titulado, 
      header: 'Fecha de Creación',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaCreacion ? new Date(row.fechaCreacion).toLocaleDateString() : 'N/A'
    },
    { 
      accessorKey: 'fechaActualización' as keyof Titulado, 
      header: 'Fecha de Actualización',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaActualización ? new Date(row.fechaActualización).toLocaleDateString() : 'N/A'
    },
  ];

  // Define fields for the GenericForm
  const fields: FieldDefinition<Titulado>[] = [
    { name: 'titulado', label: 'Nombre del Titulado', required: true, type: 'text' },
    { 
      name: 'area', 
      label: 'Área', 
      type: 'select',
      required: true,
      options: areas.filter(area => area.activo).map(area => ({
        value: area.idarea,
        label: area.area
      }))
    },
    { 
      name: 'ficha', 
      label: 'Ficha', 
      type: 'select',
      required: true,
      options: fichas.filter(ficha => ficha.activo).map(ficha => ({
        value: ficha.idficha,
        label: ficha.numficha.toString()
      }))
    },
    {
      name: 'activo',
      label: 'Estado',
      type: 'checkbox',
      required: false
    },
  ];

  // Custom submit handler to handle dates
  const handleFormSubmit = async (values: Partial<Titulado>) => {
  // If updating, add the current date as fechaActualización
    if (selectedTitulado) {
      values.fechaactualización = new Date();
    }
    // Si no se proporciona un valor para activo en un nuevo registro, establecerlo como true
    if (!selectedTitulado && values.activo === undefined) {
      values.activo = true;
    }
    return await handleSubmit(values);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Reemplazar el gráfico existente con el nuevo componente */}
        <GenericTituladosChart
          titulados={titulados}
          title="Estadísticas de Titulados"
        />
      </div>

      {/* DataTable y resto del contenido */}
      <DataTable
        data={titulados}
        columns={columns}
        title="Gestión de Titulados"
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={deleteTitulado}
        getRowId={(row) => row.idtitulado}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={selectedTitulado ? 'Editar Titulado' : 'Crear Titulado'}
          className="max-w-md z-50"
        >
          <GenericForm<Titulado>
            fields={fields}
            initialValues={selectedTitulado || { activo: true }}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};