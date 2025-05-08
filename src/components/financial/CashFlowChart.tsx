
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CashFlow } from "@/types";

interface CashFlowChartProps {
  data: CashFlow[];
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ data }) => {
  // Formata os dados para exibição no gráfico
  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: format(new Date(item.date), "dd/MM"),
  }));

  // Formatação de números para moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Componente de tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 shadow rounded-md border">
          <p className="font-medium">
            {format(new Date(data.date), "dd 'de' MMMM", { locale: ptBR })}
          </p>
          <p className="text-sm text-gray-500">
            Saldo inicial: {formatCurrency(data.initialBalance)}
          </p>
          <p className="text-sm text-green-600">
            Entradas: +{formatCurrency(data.inflow)}
          </p>
          <p className="text-sm text-red-600">
            Saídas: -{formatCurrency(data.outflow)}
          </p>
          <p className="text-sm font-medium mt-1">
            Saldo final: {formatCurrency(data.finalBalance)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fluxo de Caixa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedDate" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="finalBalance"
                name="Saldo"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="inflow"
                name="Entradas"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="outflow"
                name="Saídas"
                stroke="#ff7300"
                fill="#ff7300"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashFlowChart;
