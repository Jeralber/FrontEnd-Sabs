"use client"

import React from "react";
import { 
  BarChart as TremorBarChart,
  Card,
  Title,
  Subtitle
} from "@tremor/react";

export interface BarChartEventProps {
  eventType: "click" | "mouseenter" | "mouseleave";
  categoryIndex: number;
  seriesIndex: number;
  name: string;
  value: number;
  formattedValue: string;
  color: string;
}

export interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
  className?: string;
  onValueChange?: (value: BarChartEventProps | null) => void;
  title?: string;
  subtitle?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  index,
  categories,
  colors = ["blue", "sky", "indigo", "violet", "purple", "fuchsia", "pink"],
  valueFormatter = (value) => value.toString(),
  yAxisWidth = 40,
  className = "",
  onValueChange,
  title,
  subtitle,
}) => {
  const handleValueChange = (value: any) => {
    if (!onValueChange) return;
    
    if (!value) {
      onValueChange(null);
      return;
    }

    const formattedValue: BarChartEventProps = {
      eventType: "click",
      categoryIndex: value.categoryIndex || 0,
      seriesIndex: value.seriesIndex || 0,
      name: value.axisValue || "",
      value: value.value || 0,
      formattedValue: valueFormatter(value.value || 0),
      color: colors[value.seriesIndex % colors.length] || "blue",
    };
    
    onValueChange(formattedValue);
  };

  return (
    <Card className={`${className}`}>
      {title && <Title>{title}</Title>}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      <TremorBarChart
        data={data}
        index={index}
        categories={categories}
        colors={colors}
        valueFormatter={valueFormatter}
        yAxisWidth={yAxisWidth}
        onValueChange={handleValueChange}
        className="mt-4"
      />
    </Card>
  );
};