import { DataTable } from '@/components/Table/DataTable';
import { GenericForm, FieldDefinition } from '@/components/Form/GenericForm';
import { useMovimiento } from '@/hooks/Movimientos/useMovimientos';
import { Movimiento } from '@/services/Movimientos/movimientoService';
import { Modal } from '@heroui/react';
import { GenericBarChart } from '@/components/Charts/GenericBarChart';

export const MovimientoManager = () => {
  const {
    movimientos,
    selectedMovimiento,
    loading,
    error,
    isModalOpen,
    tipoMovimientos,
    personas,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
    deleteMovimiento,
  } = useMovimiento();

  // Define columns for the DataTable
  const columns = [
    { 
      accessorKey: 'TipoMovimiento' as keyof Movimiento, 
      header: 'Tipo de Movimiento',
      sortable: true,
      cell: (row: any) => {
        const tipoMovimiento = tipoMovimientos.find(tm => tm.idtipomovimiento === row.TipoMovimiento);
        return tipoMovimiento ? tipoMovimiento.tipomovimiento : row.TipoMovimiento || 'N/A';
      }
    },
    { 
      accessorKey: 'MovimientoPersona' as keyof Movimiento, 
      header: 'Persona',
      sortable: true,
      cell: (row: any) => {
        const persona = personas.find(p => p.idpersona === row.MovimientoPersona);
        return persona ? `${persona.nombre} ${persona.apellido}` : row.MovimientoPersona || 'N/A';
      }
    },
    { 
      accessorKey: 'activo' as keyof Movimiento, 
      header: 'Estado',
      sortable: true,
      cell: (row: any) => row.activo ? 'Activo' : 'Inactivo'
    },
    { 
      accessorKey: 'fechaCreacion' as keyof Movimiento, 
      header: 'Fecha de Creación',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaCreacion ? new Date(row.fechaCreacion).toLocaleDateString() : 'N/A'
    },
    { 
      accessorKey: 'fechaActualización' as keyof Movimiento, 
      header: 'Fecha de Actualización',
      isDate: true,
      sortable: true,
      cell: (row: any) => row.fechaActualización ? new Date(row.fechaActualización).toLocaleDateString() : 'N/A'
    },
  ];

  // Define fields for the GenericForm
  const fields: FieldDefinition<Movimiento>[] = [
    { 
      name: 'tipomovimiento', 
      label: 'Tipo de Movimiento', 
      required: true,
      type: 'select',
      options: tipoMovimientos.filter(tipo => tipo.activo).map(tipoMovimiento => ({
        value: tipoMovimiento.idtipomovimiento,
        label: tipoMovimiento.tipomovimiento
      }))
    },
    { 
      name: 'movimientopersona', 
      label: 'Persona', 
      required: true,
      type: 'select',
      options: personas.filter(persona => persona.activo).map(persona => ({
        value: persona.idpersona,
        label: `${persona.nombre} ${persona.apellido}`
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
  const handleFormSubmit = async (values: Partial<Movimiento>) => {
    // If updating, add the current date as fechaActualización
    if (selectedMovimiento) {
      values.fechaactualización = new Date();
    }
    // Si no se proporciona un valor para activo en un nuevo registro, establecerlo como true
    if (!selectedMovimiento && values.activo === undefined) {
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
          data={movimientos}
          dateField="fechacreacion"
          title="Personas registradas por mes"
        />
      </div>
      <DataTable<Movimiento>
        data={movimientos}
        columns={columns}
        title="Gestión de Movimientos"
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={deleteMovimiento}
        getRowId={(row) => row.idmovimiento}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={selectedMovimiento ? 'Editar Movimiento' : 'Crear Movimiento'}
          className="max-w-md z-50"
        >
          <GenericForm<Movimiento>
            fields={fields}
            initialValues={selectedMovimiento || { activo: true }}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};