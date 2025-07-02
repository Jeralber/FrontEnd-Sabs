import { DataTable } from '@/components/Table/DataTable';
import { GenericForm, FieldDefinition } from '@/components/Form/GenericForm';
import { useCentro } from '@/hooks/Centros/useCentros';
import { Centro } from '@/services/Centros/centroService';
import { Modal } from '@heroui/react';
import { GenericBarChart } from '@/components/Charts/GenericBarChart';

export const CentroManager = () => {
  const {
    centros,
    selectedCentro,
    loading,
    error,
    isModalOpen,
    municipios,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
    deleteCentro,
  } = useCentro();

  const columns = [
    { 
      accessorKey: 'Centro' as keyof Centro, 
      header: 'Centro',
      sortable: true 
    },
    { 
      accessorKey: 'Municipio' as keyof Centro, 
      header: 'Municipio',
      sortable: true,
      cell: (row: any) => {
        const municipio = municipios.find(m => m.idmunicipio === row.Municipio);
        return municipio ? municipio.municipio : row.Municipio || 'N/A';
      }
    },
    { 
      accessorKey: 'activo' as keyof Centro, 
      header: 'Estado',
      sortable: true,
      cell: (row: any) => row.activo ? 'Activo' : 'Inactivo'
    },
    { 
      accessorKey: 'fechaCreacion' as keyof Centro, 
      header: 'Fecha de Creación',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaCreacion ? new Date(row.fechaCreacion).toLocaleDateString() : 'N/A'
    },
    { 
      accessorKey: 'fechaActualización' as keyof Centro, 
      header: 'Fecha de Actualización',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaActualización ? new Date(row.fechaActualización).toLocaleDateString() : 'N/A'
    },
  ];
 
  const fields: FieldDefinition<Centro>[] = [
    { name: 'centro', label: 'Nombre del Centro', required: true, type: 'text' },
    { 
      name: 'municipio', 
      label: 'Municipio', 
      type: 'select',
      options: municipios.map(municipio => ({
        value: municipio.idmunicipio,
        label: municipio.municipio
      }))
    },
    {
      name: 'activo',
      label: 'Estado',
      type: 'checkbox',
      required: false
    },
  ];


  const handleFormSubmit = async (values: Partial<Centro>) => {

    if (selectedCentro) {
      values.fechaactualización = new Date();
    }
    // Si no se proporciona un valor para activo en un nuevo registro, establecerlo como true
    if (!selectedCentro && values.activo === undefined) {
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
          data={centros}
          dateField="fechacreacion"
          title="Personas registradas por mes"
        />
      </div>
      <DataTable<Centro>
        data={centros}
        columns={columns}
        title="Gestión de Centros"
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={deleteCentro}
        getRowId={(row) => row.idcentro}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={selectedCentro ? 'Editar Centro' : 'Crear Centro'}
          className="max-w-md z-50"
        >
          <GenericForm<Centro>
            fields={fields}
            initialValues={selectedCentro || { activo: true }}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};