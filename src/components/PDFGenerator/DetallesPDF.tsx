import React from "react";
import PDFBase from "./PDFBase";
import PDFTable from "./PDFTable";
import { Models } from "../../types/types";

// Tipo de datos a mostrar
type ReportType =
  | "normal"
  | "personas"
  | "encargados"
  | "solicitantes"
  | "aprobadores";

interface DetallesPDFProps {
  data: Partial<Models["Detalles"]>[];
  startDate?: string;
  endDate?: string;
  reportType?: ReportType;
}

const DetallesPDF: React.FC<DetallesPDFProps> = ({
  data,
  startDate,
  endDate,
  reportType = "normal",
}) => {
  // Columnas para el reporte normal
  const normalColumns = [
    { header: "ID", accessor: "iddetalle", width: "10%" },
    { header: "Cantidad", accessor: "cantidasolicitada", width: "10%" },
    { header: "Descripción", accessor: "descripcion", width: "20%" },
    {
      header: "Solicitante",
      accessor: "personasolicitaRelation.nombre",
      width: "20%",
    },
    {
      header: "Encargado",
      accessor: "personaencargadaRelation.nombre",
      width: "20%",
    },
    {
      header: "Aprobador",
      accessor: "personaapruebaRelation.nombre",
      width: "20%",
    },
  ];

  // Columnas para reportes de personas
  const personasColumns = [
    { header: "Nombre", accessor: "name", width: "60%" },
    { header: "Cantidad de Registros", accessor: "count", width: "40%" },
  ];

  // Transformar los datos según el tipo de reporte
  let transformedData = [];
  let title = "Reporte de Detalles";
  let columns = normalColumns;

  if (reportType === "normal") {
    // Transformación para reporte normal
    transformedData = data.map((detalle) => ({
      ...detalle,
      // Formatear nombres completos para personas
      personasolicitaRelation: detalle.personasolicitaRelation
        ? {
            ...detalle.personasolicitaRelation,
            nombre: `${detalle.personasolicitaRelation.nombre || ""} ${detalle.personasolicitaRelation.apellido || ""}`,
          }
        : undefined,
      personaencargadaRelation: detalle.personaencargadaRelation
        ? {
            ...detalle.personaencargadaRelation,
            nombre: `${detalle.personaencargadaRelation.nombre || ""} ${detalle.personaencargadaRelation.apellido || ""}`,
          }
        : undefined,
      personaapruebaRelation: detalle.personaapruebaRelation
        ? {
            ...detalle.personaapruebaRelation,
            nombre: `${detalle.personaapruebaRelation.nombre || ""} ${detalle.personaapruebaRelation.apellido || ""}`,
          }
        : undefined,
    }));
  } else {
    // Configuración para reportes de personas
    columns = personasColumns;

    // Crear un mapa para contar ocurrencias
    const countMap = new Map<string, number>();

    switch (reportType) {
      case "personas":
        title = "Reporte de Todas las Personas";
        // Contar todas las personas involucradas
        data.forEach((detalle) => {
          // Contar persona encargada
          if (detalle.personaencargadaRelation?.nombre) {
            const nombreCompleto = `${detalle.personaencargadaRelation.nombre || ""} ${detalle.personaencargadaRelation.apellido || ""}`;
            countMap.set(
              nombreCompleto,
              (countMap.get(nombreCompleto) || 0) + 1
            );
          }

          // Contar persona que solicita
          if (detalle.personasolicitaRelation?.nombre) {
            const nombreCompleto = `${detalle.personasolicitaRelation.nombre || ""} ${detalle.personasolicitaRelation.apellido || ""}`;
            countMap.set(
              nombreCompleto,
              (countMap.get(nombreCompleto) || 0) + 1
            );
          }

          // Contar persona que aprueba
          if (detalle.personaapruebaRelation?.nombre) {
            const nombreCompleto = `${detalle.personaapruebaRelation.nombre || ""} ${detalle.personaapruebaRelation.apellido || ""}`;
            countMap.set(
              nombreCompleto,
              (countMap.get(nombreCompleto) || 0) + 1
            );
          }
        });
        break;

      case "encargados":
        title = "Reporte de Personas Encargadas";
        // Contar solo personas encargadas
        data.forEach((detalle) => {
          if (detalle.personaencargadaRelation?.nombre) {
            const nombreCompleto = `${detalle.personaencargadaRelation.nombre || ""} ${detalle.personaencargadaRelation.apellido || ""}`;
            countMap.set(
              nombreCompleto,
              (countMap.get(nombreCompleto) || 0) + 1
            );
          }
        });
        break;

      case "solicitantes":
        title = "Reporte de Personas Solicitantes";
        // Contar solo personas que solicitan
        data.forEach((detalle) => {
          if (detalle.personasolicitaRelation?.nombre) {
            const nombreCompleto = `${detalle.personasolicitaRelation.nombre || ""} ${detalle.personasolicitaRelation.apellido || ""}`;
            countMap.set(
              nombreCompleto,
              (countMap.get(nombreCompleto) || 0) + 1
            );
          }
        });
        break;

      case "aprobadores":
        title = "Reporte de Personas Aprobadoras";
        // Contar solo personas que aprueban
        data.forEach((detalle) => {
          if (detalle.personaapruebaRelation?.nombre) {
            const nombreCompleto = `${detalle.personaapruebaRelation.nombre || ""} ${detalle.personaapruebaRelation.apellido || ""}`;
            countMap.set(
              nombreCompleto,
              (countMap.get(nombreCompleto) || 0) + 1
            );
          }
        });
        break;
    }

    // Convertir el mapa a un array para la tabla
    transformedData = Array.from(countMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));

    // Ordenar por cantidad (mayor a menor)
    transformedData.sort((a, b) => b.count - a.count);
  }

  const dateRange =
    startDate && endDate
      ? `Período: ${new Date(startDate).toLocaleDateString("es-ES")} - ${new Date(endDate).toLocaleDateString("es-ES")}`
      : "Reporte completo";

  return (
    <PDFBase title={title} subtitle={dateRange}>
      <PDFTable columns={columns} data={transformedData} />
    </PDFBase>
  );
};

export default DetallesPDF;
