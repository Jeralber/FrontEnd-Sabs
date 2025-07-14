"use client"

import { useState, useEffect } from "react";
import { Card, Title, BarChart as TremorBarChart } from "@tremor/react";
import { DonutChart } from "@tremor/react";
import { FaChartBar, FaChartPie, FaUser, FaUsers, FaCalendarAlt, FaChartArea } from "react-icons/fa";
import { AreaChart } from "@/components/Charts/AreaChart";

// Definimos los tipos para nuestros props
interface GenericPersonasChartProps {
  personas: any[];
  fichas?: any[];
  title: string;
  className?: string;
}

// Definimos la estructura de datos para el gráfico
interface ChartDataItem {
  name: string;
  count: number;
  value?: number; // Para compatibilidad con BarList
  color?: string; // Para asignar colores específicos
}

// Estructura para el gráfico de área
interface AreaChartDataItem {
  date: string;
  [key: string]: string | number;
}

// Tipo de datos a mostrar
type DataType = "general" | "porFicha" | "porMes";

// Tipo de gráfico a mostrar
type ChartType = "bar" | "donut" | "area";

// Colores para los gráficos
const CHART_COLORS = [
  "emerald", "blue", "amber", "violet", "rose", "indigo", "cyan", 
  "fuchsia", "green", "purple", "orange", "teal"
];

// Colores para los gráficos de área (en formato hexadecimal)
const AREA_CHART_COLORS = ["#3b82f6", "#10b981", "#f97316", "#8b5cf6", "#ec4899", "#14b8a6"];

// Nombres de los meses en español
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Abreviaciones de meses para el gráfico
const MESES_ABREV = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

export function GenericPersonasChart({
  personas,
  fichas,
  title,
  className = "h-72",
}: GenericPersonasChartProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [areaChartData, setAreaChartData] = useState<AreaChartDataItem[]>([]);
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [dataType, setDataType] = useState<DataType>("porMes");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState<any>(null);

  useEffect(() => {
    if (!personas || personas.length === 0) return;

    let formattedData: ChartDataItem[] = [];
    let formattedAreaData: AreaChartDataItem[] = [];
    let formattedBarData: any[] = [];
    let chartCategories: string[] = [];

    if (dataType === "general") {
      // Contar personas por rol
      const rolMap = new Map<string, number>();
      
      personas.forEach(persona => {
        // Corregir acceso al nombre del rol
        const rolName = persona.rol?.nombreRol || persona.rol || 'Sin Rol';
        rolMap.set(rolName, (rolMap.get(rolName) || 0) + 1);
      });
      
      formattedData = Array.from(rolMap.entries()).map(([name, count], index) => ({
        name,
        count,
        value: count,
        color: CHART_COLORS[index % CHART_COLORS.length]
      }));

      // Preparar datos para gráfico de área
      const areaData: AreaChartDataItem = { date: "Roles" };
      chartCategories = [];
      
      formattedData.slice(0, 5).forEach(item => {
        areaData[item.name] = item.count;
        chartCategories.push(item.name);
      });
      
      formattedAreaData = [areaData];
      
      // Preparar datos para gráfico de barras de Tremor con colores variados
      formattedBarData = formattedData.slice(0, 10).map((item, index) => ({
        name: item.name,
        "Cantidad": item.count,
        color: CHART_COLORS[index % CHART_COLORS.length]
      }));
    } else if (dataType === "porFicha" && fichas && fichas.length > 0) {
      // Contar personas por ficha
      const fichaMap = new Map<string, number>();
      
      personas.forEach(persona => {
        if (persona.Ficha) {
          const ficha = fichas.find(f => f.idFicha === persona.Ficha);
          const fichaName = ficha ? `Ficha ${ficha.numFicha}` : `Ficha ${persona.Ficha}`;
          fichaMap.set(fichaName, (fichaMap.get(fichaName) || 0) + 1);
        }
      });
      
      formattedData = Array.from(fichaMap.entries()).map(([name, count], index) => ({
        name,
        count,
        value: count,
        color: CHART_COLORS[index % CHART_COLORS.length]
      }));

      // Preparar datos para gráfico de área
      const areaData: AreaChartDataItem = { date: "Fichas" };
      chartCategories = [];
      
      formattedData.slice(0, 5).forEach(item => {
        areaData[item.name] = item.count;
        chartCategories.push(item.name);
      });
      
      formattedAreaData = [areaData];
      
      // Preparar datos para gráfico de barras de Tremor
      formattedBarData = formattedData.slice(0, 10).map(item => ({
        name: item.name,
        "Cantidad": item.count
      }));
    } else if (dataType === "porMes") {
      // Contar personas por mes de creación
      const mesMap = new Map<string, number>();
      
      // Inicializar todos los meses con 0
      MESES.forEach(mes => {
        mesMap.set(mes, 0);
      });
      
      // Contar personas por mes
      personas.forEach(persona => {
        if (persona.fechaCreacion) {
          const fecha = new Date(persona.fechaCreacion);
          const mes = MESES[fecha.getMonth()];
          mesMap.set(mes, (mesMap.get(mes) || 0) + 1);
        }
      });
      
      formattedData = Array.from(mesMap.entries()).map(([name, count]) => ({
        name,
        count,
        value: count
      }));

      // Preparar datos para gráfico de área
      formattedAreaData = MESES.map((mes, index) => {
        const item = formattedData.find(d => d.name === mes);
        return {
          date: MESES_ABREV[index],
          Personas: item ? item.count : 0
        };
      });
      
      chartCategories = ["Personas"];
      
      // Preparar datos para gráfico de barras de Tremor
      formattedBarData = MESES.map((mes, index) => {
        const item = formattedData.find(d => d.name === mes);
        return {
          name: MESES_ABREV[index],
          "Cantidad": item ? item.count : 0
        };
      });
    }

    // Ordenar por cantidad (mayor a menor) para gráficos de donut y barras
    formattedData.sort((a, b) => b.count - a.count);

    // Si es por mes, ordenar por orden cronológico
    if (dataType === "porMes") {
      formattedData.sort((a, b) => {
        return MESES.indexOf(a.name) - MESES.indexOf(b.name);
      });
      
      // También ordenar los datos de barras por orden cronológico
      formattedBarData.sort((a, b) => {
        if (dataType === "porMes") {
          return MESES_ABREV.indexOf(a.name) - MESES_ABREV.indexOf(b.name);
        }
        return 0;
      });
    } else {
      // Limitar a los 10 primeros para mejor visualización (excepto para meses)
      formattedData = formattedData.slice(0, 10);
    }

    setChartData(formattedData);
    setAreaChartData(formattedAreaData);
    setBarChartData(formattedBarData);
    setCategories(chartCategories);
  }, [personas, fichas, dataType]);

  // Función para cambiar entre tipos de gráficos
  const toggleChartType = () => {
    setChartType(prevType => {
      if (prevType === "bar") return "donut";
      if (prevType === "donut") return "area";
      return "bar";
    });
  };

  // Obtener el título según el tipo de datos
  const getDataTypeTitle = () => {
    switch (dataType) {
      case "general": return "Personas por Rol";
      case "porFicha": return "Personas por Ficha";
      case "porMes": return "Personas por Mes";
      default: return "";
    }
  };

  // Obtener el icono según el tipo de gráfico
  const getChartTypeIcon = () => {
    switch (chartType) {
      case "bar": return <FaChartPie size={14} />;
      case "donut": return <FaChartArea size={14} />;
      case "area": return <FaChartBar size={14} />;
      default: return <FaChartBar size={14} />;
    }
  };

  // Obtener el texto según el tipo de gráfico
  const getChartTypeText = () => {
    switch (chartType) {
      case "bar": return "Circular";
      case "donut": return "Área";
      case "area": return "Barras";
      default: return "Barras";
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
            onClick={() => setDataType("general")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
              dataType === "general" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <FaUser size={14} />
            <span>Por Rol</span>
          </button>
          
          <button 
            onClick={() => setDataType("porFicha")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
              dataType === "porFicha" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <FaUsers size={14} />
            <span>Por Ficha</span>
          </button>
          
          <button 
            onClick={() => setDataType("porMes")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
              dataType === "porMes" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <FaCalendarAlt size={14} />
            <span>Por Mes</span>
          </button>
          
          <button 
            onClick={toggleChartType}
            className="ml-auto px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 flex items-center gap-1.5 text-sm"
            title={`Cambiar a gráfico de ${getChartTypeText().toLowerCase()}`}
          >
            {getChartTypeIcon()}
            <span>{getChartTypeText()}</span>
          </button>
        </div>
      </div>
      
      {chartData.length > 0 ? (
        <div className="mt-4">
          {chartType === "bar" && (
            <Card className={className}>
              <Title>{getDataTypeTitle()}</Title>
              <TremorBarChart
                // En la sección de renderizado del gráfico de barras, modificar:
                  className="mt-4 h-60"
                  data={barChartData}
                  index="name"
                  categories={["Cantidad"]}
                  colors={dataType === "porMes" ? ["green", "blue", "amber", "violet", "rose"] : CHART_COLORS}
                  valueFormatter={(value: number) => `${value} ${value === 1 ? 'persona' : 'personas'}`}
                  yAxisWidth={48}
                  onValueChange={(v) => setSelectedValue(v)}
                />
              {selectedValue && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                  <p><strong>{selectedValue.name}</strong>: {selectedValue.Cantidad} {selectedValue.Cantidad === 1 ? 'persona' : 'personas'}</p>
                </div>
              )}
            </Card>
          )}
          
          {chartType === "donut" && (
            <DonutChart
              className={className}
              data={chartData}
              category="count"
              index="name"
              colors={dataType === "porMes" ? CHART_COLORS : CHART_COLORS}
              valueFormatter={(value) => `${value} ${value === 1 ? 'persona' : 'personas'}`}
            />
          )}
          
          {chartType === "area" && (
            <div className={className}>
              <AreaChart
                data={areaChartData}
                index="date"
                categories={categories}
                colors={AREA_CHART_COLORS}
                valueFormatter={(value: number) => `${value} ${value === 1 ? 'persona' : 'personas'}`}
                onValueChange={(v) => setSelectedValue(v)}
              />
              {selectedValue && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                  <p><strong>{selectedValue[0]?.payload?.date}</strong></p>
                  <ul>
                    {selectedValue.map((item: any, index: number) => (
                      <li key={index}>
                        {item.name}: {item.value} {item.value === 1 ? 'persona' : 'personas'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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