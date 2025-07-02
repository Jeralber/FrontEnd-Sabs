"use client"

import { useState, useEffect } from "react";
import { BarChart } from "@/components/Charts/BarChart";
import { DonutChart } from "@tremor/react";
import { FaChartBar, FaChartPie, FaUser, FaUserCog, FaUserCheck, FaUserEdit } from "react-icons/fa";
import { Models } from "@/types/types";

// Definimos los tipos para nuestros props
interface GenericDetallesChartProps {
  detalles: Partial<Models["Detalles"]>[];
  title: string;
  className?: string;
}

// Definimos la estructura de datos para el gráfico
interface ChartDataItem {
  name: string;
  count: number;
}

// Tipo de datos a mostrar
type DataType = "personas" | "encargados" | "solicitantes" | "aprobadores";

// Colores para los gráficos
const CHART_COLORS = [
  "emerald", "blue", "amber", "violet", "rose", "indigo", "cyan", 
  "fuchsia", "green", "purple", "orange", "teal"
];

export function GenericDetallesChart({
  detalles,
  title,
  className = "h-72",
}: GenericDetallesChartProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [chartType, setChartType] = useState<"bar" | "donut">("bar");
  const [dataType, setDataType] = useState<DataType>("personas");

  useEffect(() => {
    if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
      setChartData([]);
      return;
    }

    let formattedData: ChartDataItem[] = [];
    const countMap = new Map<string, number>();

    switch (dataType) {
      case "personas":
        // Contar todas las personas involucradas (puede haber duplicados)
        detalles.forEach(detalle => {
          // Contar persona encargada
          if (detalle.personaencargadaRelation?.nombre) {
            const nombreCompleto = `${detalle.personaencargadaRelation.nombre} ${detalle.personaencargadaRelation.apellido || ''}`;
            countMap.set(nombreCompleto, (countMap.get(nombreCompleto) || 0) + 1);
          }
          
          // Contar persona que solicita
          if (detalle.personasolicitaRelation?.nombre) {
            const nombreCompleto = `${detalle.personasolicitaRelation.nombre} ${detalle.personasolicitaRelation.apellido || ''}`;
            countMap.set(nombreCompleto, (countMap.get(nombreCompleto) || 0) + 1);
          }
          
          // Contar persona que aprueba
          if (detalle.personaapruebaRelation?.nombre) {
            const nombreCompleto = `${detalle.personaapruebaRelation.nombre} ${detalle.personaapruebaRelation.apellido || ''}`;
            countMap.set(nombreCompleto, (countMap.get(nombreCompleto) || 0) + 1);
          }
        });
        break;
        
      case "encargados":
        // Contar solo personas encargadas
        detalles.forEach(detalle => {
          if (detalle.personaencargadaRelation?.nombre) {
            const nombreCompleto = `${detalle.personaencargadaRelation.nombre} ${detalle.personaencargadaRelation.apellido || ''}`;
            countMap.set(nombreCompleto, (countMap.get(nombreCompleto) || 0) + 1);
          }
        });
        break;
        
      case "solicitantes":
        // Contar solo personas que solicitan
        detalles.forEach(detalle => {
          if (detalle.personasolicitaRelation?.nombre) {
            const nombreCompleto = `${detalle.personasolicitaRelation.nombre} ${detalle.personasolicitaRelation.apellido || ''}`;
            countMap.set(nombreCompleto, (countMap.get(nombreCompleto) || 0) + 1);
          }
        });
        break;
        
      case "aprobadores":
        // Contar solo personas que aprueban
        detalles.forEach(detalle => {
          if (detalle.personaapruebaRelation?.nombre) {
            const nombreCompleto = `${detalle.personaapruebaRelation.nombre} ${detalle.personaapruebaRelation.apellido || ''}`;
            countMap.set(nombreCompleto, (countMap.get(nombreCompleto) || 0) + 1);
          }
        });
        break;
    }

    // Convertir el mapa a un array para el gráfico
    formattedData = Array.from(countMap.entries()).map(([name, count]) => ({
      name,
      count
    }));

    // Ordenar por cantidad (mayor a menor)
    formattedData.sort((a, b) => b.count - a.count);

    // Limitar a los 10 primeros para mejor visualización
    formattedData = formattedData.slice(0, 10);

    setChartData(formattedData);
  }, [detalles, dataType]);

  // Función para cambiar entre tipos de gráficos
  const toggleChartType = () => {
    setChartType(prevType => prevType === "bar" ? "donut" : "bar");
  };

  // Obtener el título según el tipo de datos
  const getDataTypeTitle = () => {
    switch (dataType) {
      case "personas": return "Todas las Personas";
      case "encargados": return "Personas Encargadas";
      case "solicitantes": return "Personas Solicitantes";
      case "aprobadores": return "Personas Aprobadoras";
      default: return "";
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-medium">
          {title} - {getDataTypeTitle()}
        </h3>
        
        {/* Botones de filtro */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setDataType("personas")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
              dataType === "personas" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <FaUser size={14} />
            <span>Todas</span>
          </button>
          
          <button 
            onClick={() => setDataType("encargados")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
              dataType === "encargados" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <FaUserCog size={14} />
            <span>Encargados</span>
          </button>
          
          <button 
            onClick={() => setDataType("solicitantes")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
              dataType === "solicitantes" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <FaUserEdit size={14} />
            <span>Solicitantes</span>
          </button>
          
          <button 
            onClick={() => setDataType("aprobadores")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
              dataType === "aprobadores" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <FaUserCheck size={14} />
            <span>Aprobadores</span>
          </button>
          
          <button 
            onClick={toggleChartType}
            className="ml-auto px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 flex items-center gap-1.5 text-sm"
            title={chartType === "bar" ? "Cambiar a gráfico circular" : "Cambiar a gráfico de barras"}
          >
            {chartType === "bar" ? <FaChartPie size={14} /> : <FaChartBar size={14} />}
            <span>{chartType === "bar" ? "Circular" : "Barras"}</span>
          </button>
        </div>
      </div>
      
      {chartData.length > 0 ? (
        <div className="mt-4">
          {chartType === "bar" ? (
            <BarChart
              className={className}
              data={chartData}
              index="name"
              categories={["count"]}
              colors={["green"]}
              valueFormatter={(value) => `${value} ${value === 1 ? 'registro' : 'registros'}`}
              yAxisWidth={48}
            />
          ) : (
            <DonutChart
              className={className}
              data={chartData}
              category="count"
              index="name"
              colors={CHART_COLORS}
              valueFormatter={(value) => `${value} ${value === 1 ? 'registro' : 'registros'}`}
            />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 text-gray-500 mt-4">
          No hay datos disponibles para mostrar
        </div>
      )}
    </div>
  );
}