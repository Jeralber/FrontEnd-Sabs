"use client"

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts"

interface Props {
  data: any[]
  index: string
  categories: string[]
  className?: string
  colors?: string[]
  valueFormatter?: (value: number) => string
  onValueChange?: (value: any) => void
}

export const AreaChart = ({
  data,
  index,
  categories,
  className = "",
  colors = ["#3b82f6", "#10b981", "#f97316"],
  valueFormatter,
  onValueChange,
}: Props) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null

    if (onValueChange) onValueChange(payload)

    return (
      <div className="rounded-md border bg-white p-2 shadow-sm text-sm text-gray-800">
        <strong>{label}</strong>
        <ul>
          {payload.map((entry: any, i: number) => (
            <li key={i}>
              {entry.name}:{" "}
              {valueFormatter
                ? valueFormatter(entry.value)
                : entry.value.toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={index} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {categories.map((cat, i) => (
            <Area
              key={cat}
              type="monotone"
              dataKey={cat}
              stackId="1"
              stroke={colors[i % colors.length]}
              fill={colors[i % colors.length]}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  )
}