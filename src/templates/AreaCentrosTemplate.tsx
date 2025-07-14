import { DataTable } from '@/components/Table/DataTable';
import { GenericForm, FieldDefinition } from '@/components/Form/GenericForm';
import { useAreaCentro } from '@/hooks/AreaCentros/useAreaCentros';
import { AreaCentro } from '@/services/AreaCentros/areaCentroService';
import { Modal } from '@heroui/react';
import { GenericBarChart } from '@/components/Charts/GenericBarChart';

export const AreaCentroManager = () => {
  const {
    areaCentros,
    selectedAreaCentro,
    loading,
    error,
    isModalOpen,
    centros,
    areas,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
    deleteAreaCentro,
  } = useAreaCentro();

  const columns = [
    { 
      accessorKey: 'Centro' as keyof AreaCentro, 
      header: 'Centro',
      sortable: true,
      cell: (row: any) => {
        const centro = centros.find(c => c.idcentro === row.Centro);
        return centro ? centro.centro : row.Centro || 'N/A';
      }
    },
    { 
      accessorKey: 'Area' as keyof AreaCentro, 
      header: 'Área',
      sortable: true,
      cell: (row: any) => {
        const area = areas.find(a => a.idarea === row.Area);
        return area ? area.area : row.Area || 'N/A';
      }
    },
    { 
      accessorKey: 'activo' as keyof AreaCentro, 
      header: 'Estado',
      sortable: true,
      cell: (row: any) => row.activo ? 'Activo' : 'Inactivo'
    },
    { 
      accessorKey: 'fechaCreacion' as keyof AreaCentro, 
      header: 'Fecha de Creación',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaCreacion ? new Date(row.fechaCreacion).toLocaleDateString() : 'N/A'
    },
    { 
      accessorKey: 'fechaActualización' as keyof AreaCentro, 
      header: 'Fecha de Actualización',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaActualización ? new Date(row.fechaActualización).toLocaleDateString() : 'N/A'
    },
  ];


  const fields: FieldDefinition<AreaCentro>[] = [
    { 
      name: 'centro', 
      label: 'Centro', 
      required: true,
      type: 'select',
      options: centros.filter(centro => centro.activo).map(centro => ({
        value: centro.idcentro,
        label: centro.centro
      }))
    },
    { 
      name: 'area', 
      label: 'Área', 
      required: true,
      type: 'select',
      options: areas.filter(area => area.activo).map(area => ({
        value: area.idarea,
        label: area.area
      }))
    },
    {
      name: 'activo',
      label: 'Estado',
      type: 'checkbox',
      required: false
    },
  ];

 
  const handleFormSubmit = async (values: Partial<AreaCentro>) => {
    if (selectedAreaCentro) {
      values.fechaactualización = new Date();
    }
    // Si no se proporciona un valor para activo en un nuevo registro, establecerlo como true
    if (!selectedAreaCentro && values.activo === undefined) {
      values.activo = true;
    }
    return await handleSubmit(values);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  // Verificar si hay áreas y centros disponibles
  const noAreas = areas.filter(a => a.activo).length === 0;
  const noCentros = centros.filter(c => c.activo).length === 0;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <GenericBarChart
          data={areaCentros}
          dateField="fechacreacion"
          title="Personas registradas por mes"
        />
      </div>
      <DataTable<AreaCentro>
        data={areaCentros}
        columns={columns}
        title="Gestión de Relaciones Área-Centro"
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={deleteAreaCentro}
        getRowId={(row) => row.idareacentro}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={selectedAreaCentro ? 'Editar Relación Área-Centro' : 'Crear Relación Área-Centro'}
          className="max-w-md z-50"
        >
          {(noAreas || noCentros) ? (
            <div className="p-4 text-center">
              <p className="text-red-500 mb-4">
                {noAreas && noCentros 
                  ? 'No hay áreas ni centros disponibles. Debe crear al menos un área y un centro primero.' 
                  : noAreas 
                    ? 'No hay áreas disponibles. Debe crear al menos un área primero.' 
                    : 'No hay centros disponibles. Debe crear al menos un centro primero.'}
              </p>
              <button
                onClick={handleCancel}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Entendido
              </button>
            </div>
          ) : (
            <GenericForm<AreaCentro>
              fields={fields}
              initialValues={selectedAreaCentro || { activo: true }}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          )}
        </Modal>
      )}
    </div>
  );
};