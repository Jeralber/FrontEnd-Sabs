"use client";


//DEBO DE AÑADIR TABLAS PARA TOMAR  DECISIONES

import { useState, useEffect } from "react";
import { DonutChart, BarChart as TremorBarChart } from "@tremor/react";
import { FaChartBar, FaChartPie } from "react-icons/fa";

// Props genéricos
interface GenericBarChartProps<T> {
  data: T[];
  dateField: keyof T;
  title: string;
  className?: string;
  showDataPreview?: boolean;
}

// Estructura del dato del gráfico
interface ChartDataItem {
  name: string;
  count: number;
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const CHART_COLORS = [
  "indigo", "cyan", "rose", "lime", "amber", "purple",
  "fuchsia", "teal", "blue", "orange", "emerald", "pink"
];

export function GenericBarChart<T>({
  data,
  dateField,
  title,
  className = "h-72",
  showDataPreview = false
}: GenericBarChartProps<T>) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [value, setValue] = useState<ChartDataItem | undefined>(undefined);
  const [chartType, setChartType] = useState<"bar" | "donut">("bar");

  useEffect(() => {
    if (!data || data.length === 0) return;

    const monthCounts: Record<string, number> = {};
    MONTH_NAMES.forEach((month) => (monthCounts[month] = 0));

    data.forEach((item) => {
      const rawDate = item[dateField];
      if (rawDate) {
        const date = new Date(rawDate as string | number | Date);
        if (!isNaN(date.getTime())) {
          const monthName = MONTH_NAMES[date.getMonth()];
          monthCounts[monthName]++;
        }
      }
    });

    const formatted = Object.entries(monthCounts).map(([name, count]) => ({
      name,
      count
    }));

    setChartData(formatted);
  }, [data, dateField]);

  const toggleChartType = () => {
    setChartType(prev => (prev === "bar" ? "donut" : "bar"));
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <button
          onClick={toggleChartType}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          title={chartType === "bar" ? "Cambiar a gráfico circular" : "Cambiar a gráfico de barras"}
        >
          {chartType === "bar" ? <FaChartPie size={20} /> : <FaChartBar size={20} />}
        </button>
      </div>

      {chartData.some(item => item.count > 0) ? (
        <div className="w-full min-h-[300px]">
          {chartType === "bar" ? (
            <TremorBarChart
              className={className}
              data={chartData}
              index="name"
              categories={["count"]}
              colors={["blue"]}
              valueFormatter={(value) => `${value} registros`}
              yAxisWidth={48}
              onValueChange={(val) => val ? setValue(val as unknown as ChartDataItem) : setValue(undefined)}
            />
          ) : (
            <DonutChart
              className={className}
              data={chartData.filter(item => item.count > 0)}
              category="count"
              index="name"
              colors={CHART_COLORS}
              valueFormatter={(value) => `${value} registros`}
              onValueChange={(val) => setValue(val as ChartDataItem)}
            />
          )}

          {showDataPreview && value && (
            <pre className="mt-4 rounded-md bg-gray-100 p-3 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200 overflow-auto">
              {JSON.stringify(value, null, 2)}
            </pre>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 text-gray-500">
          No hay datos disponibles para mostrar
        </div>
      )}
    </div>
  );
}
