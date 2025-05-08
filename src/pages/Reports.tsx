
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  ArrowDownIcon, 
  ArrowRightIcon, 
  ArrowUpIcon, 
  Calendar as CalendarIcon,
  Download
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { DateRange } from "@/types";

// Sample data for Sales by Period
const salesData = [
  { name: "Jan", value: 7800 },
  { name: "Fev", value: 6500 },
  { name: "Mar", value: 9100 },
  { name: "Abr", value: 8200 },
  { name: "Mai", value: 10500 },
  { name: "Jun", value: 9800 },
];

// Sample data for Service Orders
const serviceOrdersData = [
  { name: "Jan", completed: 15, pending: 6 },
  { name: "Fev", completed: 18, pending: 5 },
  { name: "Mar", completed: 24, pending: 8 },
  { name: "Abr", completed: 22, pending: 10 },
  { name: "Mai", completed: 29, pending: 7 },
  { name: "Jun", completed: 25, pending: 9 },
];

// Sample data for Sales by Category
const salesByCategoryData = [
  { name: "Bicicletas", value: 45000 },
  { name: "Peças", value: 28000 },
  { name: "Acessórios", value: 15000 },
  { name: "Vestuário", value: 8000 },
  { name: "Serviços", value: 12000 },
];

// Sample data for top products
const topProductsData = [
  { name: "Mountain Bike 29\"", value: 12500 },
  { name: "Capacete MTB", value: 7800 },
  { name: "Câmara Aro 29", value: 5600 },
  { name: "Lubrificante Corrente", value: 4200 },
  { name: "Speed Carbono", value: 18000 },
];

// Colors for charts
const COLORS = ["#4ade80", "#60a5fa", "#f87171", "#facc15", "#c084fc", "#fb923c"];
const COLORS_FOR_COMPARISON = ["#4ade80", "#fb923c"];

const Reports = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [period, setPeriod] = useState("monthly");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    to: new Date()
  });

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  // Calculate percentage change
  const calculateChange = (currentValue: number, previousValue: number) => {
    if (previousValue === 0) return 100; // Avoid division by zero
    return ((currentValue - previousValue) / previousValue) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <Button className="flex items-center gap-1">
          <Download size={16} /> Exportar Dados
        </Button>
      </div>

      <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="inventory">Estoque</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diário</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
            {period === "custom" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                      )
                    ) : (
                      <span>Selecione um período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={(selectedRange) => {
                      if (selectedRange?.from) {
                        setDateRange({
                          from: selectedRange.from,
                          to: selectedRange.to || selectedRange.from,
                        });
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {/* Sales Report Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Receita Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-baseline">
                  <div className="text-2xl font-bold">{formatCurrency(42100)}</div>
                  <div className="flex items-center text-sm font-medium text-green-600">
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                    12.5%
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Comparado ao período anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-baseline">
                  <div className="text-2xl font-bold">183</div>
                  <div className="flex items-center text-sm font-medium text-green-600">
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                    8.2%
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Comparado ao período anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Ticket Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-baseline">
                  <div className="text-2xl font-bold">{formatCurrency(230.05)}</div>
                  <div className="flex items-center text-sm font-medium text-red-600">
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                    3.8%
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Comparado ao período anterior</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart: Sales Over Time */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Vendas por Período</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `R$ ${value}`} />
                    <RechartsTooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, "Vendas"]} />
                    <Bar dataKey="value" fill="#4ade80" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Chart: Sales by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Categoria</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salesByCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {salesByCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => [formatCurrency(value as number), "Vendas"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Chart: Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Produtos</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={topProductsData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `R$ ${value}`} />
                    <YAxis type="category" dataKey="name" />
                    <RechartsTooltip formatter={(value) => [formatCurrency(value as number), "Vendas"]} />
                    <Bar dataKey="value" fill="#60a5fa" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Service Orders Report Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total de OS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-baseline">
                  <div className="text-2xl font-bold">125</div>
                  <div className="flex items-center text-sm font-medium text-green-600">
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                    18.3%
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Comparado ao período anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">OS Concluídas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-baseline">
                  <div className="text-2xl font-bold">98</div>
                  <div className="flex items-center text-sm font-medium text-green-600">
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                    14.5%
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Comparado ao período anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Taxa de Conclusão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-baseline">
                  <div className="text-2xl font-bold">78.4%</div>
                  <div className="flex items-center text-sm font-medium text-red-600">
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                    2.1%
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Comparado ao período anterior</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Ordens de Serviço</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={serviceOrdersData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="completed" name="Concluídas" stackId="a" fill="#4ade80" />
                  <Bar dataKey="pending" name="Pendentes" stackId="a" fill="#fb923c" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Report Tab */}
        <TabsContent value="inventory" className="space-y-6">
          {/* Inventory metrics and charts would go here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total de Produtos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">312</div>
                <p className="text-xs text-gray-500 mt-1">Em estoque</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Valor do Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(248750.00)}</div>
                <p className="text-xs text-gray-500 mt-1">Custo total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Produtos em Baixa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">24</div>
                <p className="text-xs text-gray-500 mt-1">Abaixo do estoque mínimo</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Movimentação de Estoque</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { month: "Jan", entrada: 45, saida: 32 },
                  { month: "Fev", entrada: 38, saida: 36 },
                  { month: "Mar", entrada: 52, saida: 48 },
                  { month: "Abr", entrada: 40, saida: 42 },
                  { month: "Mai", entrada: 55, saida: 50 },
                  { month: "Jun", entrada: 48, saida: 45 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="entrada" 
                    name="Entradas" 
                    stroke="#4ade80" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="saida" 
                    name="Saídas" 
                    stroke="#f87171" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Report Tab */}
        <TabsContent value="customers" className="space-y-6">
          {/* Customer metrics and charts would go here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-baseline">
                  <div className="text-2xl font-bold">547</div>
                  <div className="flex items-center text-sm font-medium text-green-600">
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                    8.2%
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Comparado ao período anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Novos Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-baseline">
                  <div className="text-2xl font-bold">48</div>
                  <div className="flex items-center text-sm font-medium text-green-600">
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                    12.5%
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Neste mês</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Taxa de Retenção</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-baseline">
                  <div className="text-2xl font-bold">82.5%</div>
                  <div className="flex items-center text-sm font-medium text-green-600">
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                    3.2%
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Nos últimos 6 meses</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compras por Cliente</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: "1x", count: 124 },
                  { name: "2-3x", count: 85 },
                  { name: "4-5x", count: 56 },
                  { name: "6-10x", count: 38 },
                  { name: "10+", count: 25 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip formatter={(value) => [`${value} clientes`, "Total"]} />
                  <Bar dataKey="count" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
