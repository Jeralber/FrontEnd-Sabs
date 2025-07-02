import { DataTable } from "@/components/Table/DataTable";
import { GenericForm, FieldDefinition } from "@/components/Form/GenericForm";
import { usePersona } from "@/hooks/Personas/usePersonas";
import { Persona } from "@/services/Personas/personaService";
import { Modal } from "@heroui/react";
import { GenericPersonasChart } from "@/components/Charts/GenericPersonasChart";

export const PersonaManager = () => {
  const {
    personas,
    selectedPersona,
    loading,
    error,
    isModalOpen,
    fichas,
    roles,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
    deletePersona,
  } = usePersona();

  // Define columns for the DataTable
  const columns = [
    {
      accessorKey: "identificacion" as keyof Persona,
      header: "Identificación",
      sortable: true,
    },
    {
      accessorKey: "nombre" as keyof Persona,
      header: "Nombre",
      sortable: true,
    },
    {
      accessorKey: "apellido" as keyof Persona,
      header: "Apellido",
      sortable: true,
    },
    {
      accessorKey: "correo" as keyof Persona,
      header: "Correo",
      sortable: true,
    },
    {
      accessorKey: "telefono" as keyof Persona,
      header: "Teléfono",
      sortable: true,
    },
    {
      accessorKey: "edad" as keyof Persona,
      header: "Edad",
      sortable: true,
    },
    {
      accessorKey: "Ficha" as keyof Persona,
      header: "Ficha",
      sortable: true,
      cell: (row: any) => {
        const ficha = fichas?.find(
          (f: { idFicha: number }) => f.idFicha === row.Ficha
        );
        return ficha ? ficha.numFicha : row.Ficha || "N/A";
      },
    },
    {
      accessorKey: "Rol" as keyof Persona,
      header: "Rol",
      sortable: true,
      cell: (row: any) => {
        const rol = roles?.find((r: { idRol: number }) => r.idRol === row.Rol);
        return rol ? rol.nombreRol : row.Rol || "N/A";
      },
    },
    {
      accessorKey: "activo" as keyof Persona,
      header: "Estado",
      sortable: true,
      cell: (row: any) => (row.activo ? "Activo" : "Inactivo"),
    },
    {
      accessorKey: "fechaCreacion" as keyof Persona,
      header: "Fecha de Creación",
      isDate: true,
      sortable: true,
      cell: (row: any) =>
        row.fechaCreacion
          ? new Date(row.fechaCreacion).toLocaleDateString()
          : "N/A",
    },
    {
      accessorKey: "fechaActualización" as keyof Persona,
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
  const fields: FieldDefinition<Persona>[] = [
    {
      name: "identificacion",
      label: "Identificación",
      required: true,
      type: "text",
    },
    { name: "nombre", label: "Nombre", required: true, type: "text" },
    { name: "apellido", label: "Apellido", required: true, type: "text" },
    { name: "correo", label: "Correo", required: true, type: "email" },
    {
      name: "contrasena",
      label: "Contraseña",
      required: true,
      type: "password",
    },
    { name: "telefono", label: "Teléfono", type: "text" },
    { name: "edad", label: "Edad", required: true, type: "number" },
    {
      name: "ficha",
      label: "Ficha",
      type: "select",
      options:
        fichas
          ?.filter((ficha) => ficha.activo)
          .map((ficha) => ({
            value: ficha.idFicha,
            label: `${ficha.numFicha}`,
          })) || [],
    },
    {
      name: "rol",
      label: "Rol",
      type: "select",
      required: true, // Añadimos required: true
      options:
        roles
          ?.filter((rol) => rol.activo)
          .map((rol) => ({
            value: rol.idRol,
            label: rol.nombreRol,
          })) || [],
    },
    {
      name: "activo",
      label: "Estado",
      type: "checkbox",
      required: false,
    },
  ];

  const handleFormSubmit = async (values: Partial<Persona>) => {
    // Validación del Rol
    if (!values.rol) {
      return { error: 'El campo Rol es obligatorio' };
      return false;
    }

    if (selectedPersona) {
      values.fechaactualización = new Date();
    }
    if (!selectedPersona && values.activo === undefined) {
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
        {/* Bar chart for personas created by month */}
      
        
        {/* Nuevo gráfico para personas por rol/ficha */}
        <GenericPersonasChart
          personas={personas}
          fichas={fichas}
          title="Estadísticas de Personas"
        />
      </div>

      <DataTable<Persona>
        data={personas}
        columns={columns}
        title="Gestión de Personas"
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={deletePersona}
        getRowId={(row) => row.idpersona}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title={selectedPersona ? "Editar Persona" : "Crear Persona"}
          className="max-w-2xl z-50"
        >
          <GenericForm<Persona>
            fields={fields}
            initialValues={selectedPersona || { activo: true }}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};
