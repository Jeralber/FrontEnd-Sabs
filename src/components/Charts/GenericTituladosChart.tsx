"use client"

import { useState, useEffect } from "react";
import { Card, Title, BarChart as TremorBarChart, DonutChart } from "@tremor/react";
import { FaChartBar, FaChartPie, FaCalendarAlt, FaUserGraduate, FaChartArea } from "react-icons/fa";
import { AreaChart } from "@/components/Charts/AreaChart";

// Definimos los tipos para nuestros props
interface GenericTituladosChartProps {
  titulados: any[];
  title: string;
  className?: string;
}

// Definimos la estructura de datos para el gráfico
interface ChartDataItem {
  name: string;
  count: number;
  color?: string;
}

// Estructura para el gráfico de área
interface AreaChartDataItem {
  date: string;
  [key: string]: string | number;
}

// Tipo de datos a mostrar
type DataType = "porMes" | "porPersonas";

// Tipo de gráfico a mostrar
type ChartType = "bar" | "donut" | "area";

// Colores para los gráficos
const CHART_COLORS = [
  "emerald", "blue", "amber", "violet", "rose", "indigo", "cyan", 
  "fuchsia", "green", "purple", "orange", "teal"
];

// Colores para los gráficos de área (en formato hexadecimal)
const AREA_CHART_COLORS = ["#3b82f6", "#10b981", "#f97316", "#8b5cf6", "#ec4899", "#14b8a6"];

// Abreviaciones de meses para el gráfico
const MESES_ABREV = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

export function GenericTituladosChart({
  titulados,
  title,
  className = "h-72",
}: GenericTituladosChartProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [areaChartData, setAreaChartData] = useState<AreaChartDataItem[]>([]);
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [dataType, setDataType] = useState<DataType>("porMes");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState<any>(null);

  useEffect(() => {
    if (!titulados || titulados.length === 0) return;

    let formattedData: ChartDataItem[] = [];
    let formattedAreaData: AreaChartDataItem[] = [];
    let formattedBarData: any[] = [];
    let chartCategories: string[] = [];

    if (dataType === "porMes") {
      // Agrupar titulados por mes
      const monthMap = new Map<string, number>();
      const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      
      // Inicializar todos los meses del año actual con 0
      const currentYear = new Date().getFullYear();
      monthNames.forEach((month) => {
        monthMap.set(`${month} ${currentYear}`, 0);
      });
      
      titulados.forEach(titulado => {
        if (titulado.fechaCreacion) {
          const date = new Date(titulado.fechaCreacion);
          const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
          monthMap.set(monthYear, (monthMap.get(monthYear) || 0) + 1);
        }
      });
      
      // Convertir el mapa a array y ordenar por fecha
      const sortedEntries = Array.from(monthMap.entries())
        .map(([monthYear, count], index) => {
          const [month, year] = monthYear.split(' ');
          return { 
            monthYear, 
            month, 
            year: parseInt(year), 
            count,
            color: CHART_COLORS[index % CHART_COLORS.length]
          };
        })
        .sort((a, b) => {
          if (a.year !== b.year) return a.year - b.year;
          return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
        });
      
      formattedData = sortedEntries.map(entry => ({
        name: entry.monthYear,
        count: entry.count,
        color: entry.color
      }));
      
      // Preparar datos para gráfico de área
      formattedAreaData = sortedEntries.map(entry => {
        const monthIndex = monthNames.indexOf(entry.month);
        return {
          date: MESES_ABREV[monthIndex],
          Titulados: entry.count
        };
      });
      
      chartCategories = ["Titulados"];
      
      // Preparar datos para gráfico de barras
      formattedBarData = sortedEntries.map(entry => {
        const monthIndex = monthNames.indexOf(entry.month);
        return {
          name: MESES_ABREV[monthIndex],
          "Cantidad": entry.count,
          color: entry.color
        };
      });
    } else if (dataType === "porPersonas") {
      // Contar personas por titulado
      const tituladosData = titulados
        .filter(titulado => titulado.nombre) // Asegurarse de que tiene nombre
        .map((titulado, index) => ({
          name: titulado.nombre,
          count: titulado.cantidadPersonas || 0,
          color: CHART_COLORS[index % CHART_COLORS.length]
        }))
        .sort((a, b) => b.count - a.count) // Ordenar por cantidad de personas (mayor a menor)
        .slice(0, 10); // Limitar a los 10 primeros
      
      formattedData = tituladosData;
      
      // Preparar datos para gráfico de área
      const areaData: AreaChartDataItem = { date: "Titulados" };
      chartCategories = [];
      
      tituladosData.slice(0, 5).forEach(item => {
        areaData[item.name] = item.count;
        chartCategories.push(item.name);
      });
      
      formattedAreaData = [areaData];
      
      // Preparar datos para gráfico de barras
      formattedBarData = tituladosData.map(item => ({
        name: item.name,
        "Cantidad": item.count,
        color: item.color
      }));
    }

    setChartData(formattedData);
    setAreaChartData(formattedAreaData);
    setBarChartData(formattedBarData);
    setCategories(chartCategories);
  }, [titulados, dataType]);

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
      case "porMes": return "Titulados por Mes";
      case "porPersonas": return "Personas por Titulado";
      default: return "";
    }
  };

  // Obtener el texto del valor según el tipo de datos
  const getValueText = (value: number) => {
    switch (dataType) {
      case "porMes": return `${value} ${value === 1 ? 'titulado' : 'titulados'}`;
      case "porPersonas": return `${value} ${value === 1 ? 'persona' : 'personas'}`;
      default: return `${value}`;
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
            onClick={() => setDataType("porPersonas")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
              dataType === "porPersonas" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <FaUserGraduate size={14} />
            <span>Por Personas</span>
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
                className="mt-4 h-60"
                data={barChartData}
                index="name"
                categories={["Cantidad"]}
                colors={CHART_COLORS}
                valueFormatter={(value: number) => getValueText(value)}
                yAxisWidth={48}
                onValueChange={(v) => setSelectedValue(v)}
              />
              {selectedValue && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                  <p><strong>{selectedValue.name}</strong>: {selectedValue.Cantidad} {getValueText(selectedValue.Cantidad).split(' ').slice(1).join(' ')}</p>
                </div>
              )}
            </Card>
          )}
          
          {chartType === "donut" && (
            <Card className={className}>
              <Title>{getDataTypeTitle()}</Title>
              <DonutChart
              className={className}
              data={chartData}
              category="count"
              index="name"
              colors={dataType === "porMes" ? CHART_COLORS : CHART_COLORS}
              valueFormatter={(value) => `${value} ${value === 1 ? 'persona' : 'personas'}`}
            />
              {selectedValue && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                  <p><strong>{selectedValue.name}</strong>: {selectedValue.value} {getValueText(selectedValue.value).split(' ').slice(1).join(' ')}</p>
                </div>
              )}
            </Card>
          )}
          
          {chartType === "area" && (
            <div className={className}>
              <AreaChart
                data={areaChartData}
                index="date"
                categories={categories}
                colors={AREA_CHART_COLORS}
                valueFormatter={(value: number) => getValueText(value)}
                onValueChange={(v) => setSelectedValue(v)}
              />
              {selectedValue && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                  <p><strong>{selectedValue[0]?.payload?.date}</strong></p>
                  <ul>
                    {selectedValue.map((item: any, index: number) => (
                      <li key={index}>
                        {item.name}: {item.value} {getValueText(item.value).split(' ').slice(1).join(' ')}
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