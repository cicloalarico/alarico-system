
"use client"

import * as React from "react"
import { Area, Bar, CartesianGrid, Cell, Legend, Line, Pie, PieChart as RechartPieChart, Tooltip, XAxis, YAxis, LineChart as RechartsLineChart, BarChart as RechartsBarChart, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart"
import { cn } from "@/lib/utils"

interface BarChartProps {
  data: Record<string, any>[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
  showLegend?: boolean
  showYAxis?: boolean
  showXAxis?: boolean
  showGrid?: boolean
  customTooltip?: (props: any) => React.ReactNode
  className?: string
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["#2563eb", "#e11d48", "#f97316"],
  valueFormatter = (value: number) => `${value}`,
  showLegend = true,
  showYAxis = true,
  showXAxis = true,
  showGrid = true,
  yAxisWidth = 56,
  customTooltip,
  className
}: BarChartProps) {
  return (
    <ChartContainer className={cn(className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
          {showXAxis && <XAxis 
            dataKey={index}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tickFormatter={(value) => String(value)}
          />}
          {showYAxis && <YAxis 
            width={yAxisWidth}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => String(value)}
          />}
          <ChartTooltip
            content={({ active, payload }) => {
              if (customTooltip && active && payload && payload.length) {
                return customTooltip({ active, payload });
              }
              return (
                <ChartTooltipContent
                  active={active}
                  payload={payload}
                  formatter={valueFormatter}
                />
              );
            }}
          />
          {categories.map((category, index) => (
            <Bar 
              key={category}
              dataKey={category}
              fill={colors[index % colors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
          {showLegend && <Legend />}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

interface LineChartProps {
  data: Record<string, any>[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
  showLegend?: boolean
  showYAxis?: boolean
  showXAxis?: boolean
  showGrid?: boolean
  className?: string
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["#2563eb", "#e11d48", "#f97316"],
  valueFormatter = (value: number) => `${value}`,
  showLegend = true,
  showYAxis = true,
  showXAxis = true,
  showGrid = true,
  yAxisWidth = 56,
  className
}: LineChartProps) {
  return (
    <ChartContainer className={cn(className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
          {showXAxis && <XAxis 
            dataKey={index}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tickFormatter={(value) => String(value)}
          />}
          {showYAxis && <YAxis 
            width={yAxisWidth}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => String(value)}
          />}
          <ChartTooltip
            content={({ active, payload }) => (
              <ChartTooltipContent
                active={active}
                payload={payload}
                formatter={valueFormatter}
              />
            )}
          />
          {categories.map((category, index) => (
            <Line 
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={true}
              activeDot={{ r: 6 }}
            />
          ))}
          {showLegend && <Legend />}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

interface PieChartProps {
  data: Record<string, any>[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  showLegend?: boolean
  className?: string
}

export function PieChart({
  data,
  index,
  categories,
  colors = ["#2563eb", "#e11d48", "#f97316", "#facc15", "#a855f7", "#14b8a6"],
  valueFormatter = (value: number) => `${value}`,
  showLegend = true,
  className
}: PieChartProps) {
  const categoryValues = categories[0]; // For pie charts, we typically use a single category
  
  return (
    <ChartContainer className={cn(className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius="70%"
            dataKey={categoryValues}
            nameKey={index}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <ChartTooltip
            content={({ active, payload }) => (
              <ChartTooltipContent
                active={active}
                payload={payload}
                formatter={valueFormatter}
              />
            )}
          />
          {showLegend && <Legend />}
        </RechartPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
