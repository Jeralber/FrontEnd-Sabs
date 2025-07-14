import { DataTable } from "@/components/Table/DataTable";
import { GenericForm, FieldDefinition } from "@/components/Form/GenericForm";
import { useSede } from "@/hooks/Sedes/useSedes";
import { Sede } from "@/services/Sedes/SedeService";
import { Modal } from "@heroui/react";

import { GenericSedesChart } from "@/components/Charts/GenericSedesChart";

export const SedeManager = () => {
  const {
    sedes,
    selectedSede,
    loading,
    error,
    isModalOpen,
    centros,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
    deleteSede,
  } = useSede();

  // Define columns for the DataTable
  const columns = [
    {
      accessorKey: "sede" as keyof Sede,
      header: "Sede",
      sortable: true,
    },
    {
      accessorKey: "Centro" as keyof Sede,
      header: "Centro",
      sortable: true,
      cell: (row: any) => {
        const centro = centros.find((c) => c.idcentro === row.Centro);
        return centro ? centro.centro : row.Centro || "N/A";
      },
    },
    {
      accessorKey: "Direccion" as keyof Sede,
      header: "Dirección",
      sortable: true,
    },
    {
      accessorKey: "activo" as keyof Sede,
      header: "Estado",
      sortable: true,
      cell: (row: any) => (row.activo ? "Activo" : "Inactivo"),
    },
    {
      accessorKey: "fechaCreacion" as keyof Sede,
      header: "Fecha de Creación",
      isDate: true,
      sortable: true,
      cell: (row: any) =>
        row.fechaCreacion
          ? new Date(row.fechaCreacion).toLocaleDateString()
          : "N/A",
    },
    {
      accessorKey: "fechaActualización" as keyof Sede,
      header: "Fecha de Actualización",
      isDate: true,
      sortable: true,
      cell: (row: any) =>
        row.fechaActualización
          ? new Date(row.fechaActualización).toLocaleDateString()
          : "N/A",
    },
  ];

  // Define fields for the GenericForm
  const fields: FieldDefinition<Sede>[] = [
    { name: "sede", label: "Nombre de la Sede", required: true, type: "text" },
    {
      name: "centro",
      label: "Centro",
      type: "select",
      required: true,
      options: centros
        .filter((centro) => centro.activo)
        .map((centro) => ({
          value: centro.idcentro,
          label: centro.centro,
        })),
    },
    { name: "direccion", label: "Dirección", required: true, type: "text" },
    {
      name: "activo",
      label: "Estado",
      type: "checkbox",
      required: false,
    },
  ];

  // Custom submit handler to handle dates
  const handleFormSubmit = async (values: Partial<Sede>) => {
    // If updating, add the current date as fechaActualización
    if (selectedSede) {
      values.fechaactualización = new Date();
    }
    // Si no se proporciona un valor para activo en un nuevo registro, establecerlo como true
    if (!selectedSede && values.activo === undefined) {
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
        {/* Reemplazar o añadir junto al gráfico existente */}
        <GenericSedesChart
          sedes={sedes}
          centros={centros}
          title="Estadísticas de Sedes"
        />
      </div>

      {/* DataTable y resto del contenido */}
      <DataTable
        data={sedes}
        columns={columns}
        title="Gestión de Sedes"
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={deleteSede}
        getRowId={(row) => row.idsede}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={selectedSede ? "Editar Sede" : "Crear Sede"}
          className="max-w-md z-50"
        >
          <GenericForm<Sede>
            fields={fields}
            initialValues={selectedSede || { activo: true }}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};
