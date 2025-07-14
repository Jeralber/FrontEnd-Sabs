import { DataTable } from '@/components/Table/DataTable';
import { GenericForm, FieldDefinition } from '@/components/Form/GenericForm';
import { useSitio } from '@/hooks/Sitios/useSitios';
import { Sitio } from '@/services/Sitios/sitioService';
import { Modal } from '@heroui/react';
import { GenericBarChart } from '@/components/Charts/GenericBarChart';

export const SitioManager = () => {
  const {
    sitios,
    selectedSitio,
    loading,
    error,
    isModalOpen,
    tipoSitios,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
    deleteSitio,
  } = useSitio();

  // Define columns for the DataTable
  const columns = [
    { 
      accessorKey: 'sitio' as keyof Sitio, 
      header: 'Sitio',
      sortable: true 
    },
    { 
      accessorKey: 'TipoSitio' as keyof Sitio, 
      header: 'Tipo de Sitio',
      sortable: true,
      cell: (row: any) => {
        const tipoSitio = tipoSitios.find(ts => ts.idtipositio === row.TipoSitio);
        return tipoSitio ? tipoSitio.tipositio : row.TipoSitio || 'N/A';
      }
    },
    { 
      accessorKey: 'activo' as keyof Sitio, 
      header: 'Estado',
      sortable: true,
      cell: (row: any) => row.activo ? 'Activo' : 'Inactivo'
    },
    { 
      accessorKey: 'fechaCreacion' as keyof Sitio, 
      header: 'Fecha de Creación',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaCreacion ? new Date(row.fechaCreacion).toLocaleDateString() : 'N/A'
    },
    { 
      accessorKey: 'fechaActualización' as keyof Sitio, 
      header: 'Fecha de Actualización',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaActualización ? new Date(row.fechaActualización).toLocaleDateString() : 'N/A'
    },
  ];

  // Define fields for the GenericForm
  const fields: FieldDefinition<Sitio>[] = [
    { name: 'sitio', label: 'Nombre del Sitio', required: true, type: 'text' },
    { 
      name: 'tipositio', 
      label: 'Tipo de Sitio', 
      type: 'select',
      required: true,
      options: tipoSitios.filter(tipoSitio => tipoSitio.activo).map(tipoSitio => ({
        value: tipoSitio.idtipositio,
        label: tipoSitio.tipositio
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
  const handleFormSubmit = async (values: Partial<Sitio>) => {
    // If updating, add the current date as fechaActualización
    if (selectedSitio) {
      values.fechaactualización = new Date();
    }
    // Si no se proporciona un valor para activo en un nuevo registro, establecerlo como true
    if (!selectedSitio && values.activo === undefined) {
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
          data={sitios}
          dateField="fechacreacion"
          title="Personas registradas por mes"
        />
      </div>
      <DataTable<Sitio>
        data={sitios}
        columns={columns}
        title="Gestión de Sitios"
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={deleteSitio}
        getRowId={(row) => row.idsitio}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={selectedSitio ? 'Editar Sitio' : 'Crear Sitio'}
          className="max-w-md z-50"
        >
          <GenericForm<Sitio>
            fields={fields}
            initialValues={selectedSitio || { activo: true }}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};