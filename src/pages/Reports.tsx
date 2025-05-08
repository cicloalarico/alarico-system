
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/ui/charts";
import { Download, FileText, Search, Filter, Calendar, BarChart2, PieChart as PieChartIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Dados de vendas por mês
const salesByMonthData = [
  { month: "Jan", bicycles: 42, parts: 85, accessories: 63 },
  { month: "Fev", bicycles: 38, parts: 73, accessories: 51 },
  { month: "Mar", bicycles: 45, parts: 102, accessories: 79 },
  { month: "Abr", bicycles: 53, parts: 94, accessories: 68 },
  { month: "Mai", bicycles: 47, parts: 88, accessories: 72 },
  { month: "Jun", bicycles: 51, parts: 105, accessories: 81 },
];

// Dados de vendas por categoria
const salesByCategoryData = [
  { name: "Bicicletas", value: 45 },
  { name: "Peças", value: 30 },
  { name: "Acessórios", value: 15 },
  { name: "Serviços", value: 10 },
];

// Produtos mais vendidos
const topSellingProducts = [
  { id: 1, name: "Mountain Bike Pro X1", quantity: 24, revenue: 72000 },
  { id: 2, name: "Capacete Speed Elite", quantity: 45, revenue: 13500 },
  { id: 3, name: "Câmara de Ar Aro 29", quantity: 120, revenue: 3600 },
  { id: 4, name: "Luva Ciclismo Gel", quantity: 87, revenue: 4350 },
  { id: 5, name: "Bicicleta Urbana City", quantity: 18, revenue: 32400 },
];

// Dados de estoque
const inventoryData = [
  { category: "Bicicletas", inStock: 42, minStock: 15, maxStock: 60 },
  { category: "Componentes", inStock: 128, minStock: 50, maxStock: 200 },
  { category: "Acessórios", inStock: 85, minStock: 30, maxStock: 120 },
  { category: "Vestuário", inStock: 64, minStock: 25, maxStock: 100 },
  { category: "Ferramentas", inStock: 23, minStock: 10, maxStock: 40 },
];

// Dados de giro de estoque
const stockTurnoverData = [
  { month: "Jan", turnover: 2.3 },
  { month: "Fev", turnover: 2.1 },
  { month: "Mar", turnover: 2.7 },
  { month: "Abr", turnover: 2.5 },
  { month: "Mai", turnover: 2.2 },
  { month: "Jun", turnover: 2.6 },
];

// Produtos com baixo estoque
const lowStockProducts = [
  { id: 1, name: "Lubrificante para Corrente", category: "Manutenção", inStock: 2, minStock: 5 },
  { id: 2, name: "Câmbio Traseiro Deore", category: "Componentes", inStock: 1, minStock: 3 },
  { id: 3, name: "Pneu MTB 29\"", category: "Componentes", inStock: 3, minStock: 8 },
  { id: 4, name: "Bicicleta Infantil Aro 16", category: "Bicicletas", inStock: 0, minStock: 2 },
  { id: 5, name: "Capacete MTB", category: "Acessórios", inStock: 2, minStock: 5 },
];

// Dados de clientes por mês
const customersByMonthData = [
  { month: "Jan", new: 18, returning: 42 },
  { month: "Fev", new: 15, returning: 38 },
  { month: "Mar", new: 22, returning: 45 },
  { month: "Abr", new: 19, returning: 51 },
  { month: "Mai", new: 16, returning: 47 },
  { month: "Jun", new: 24, returning: 52 },
];

// Clientes por região
const customersByRegionData = [
  { name: "Centro", value: 35 },
  { name: "Norte", value: 25 },
  { name: "Sul", value: 20 },
  { name: "Leste", value: 15 },
  { name: "Oeste", value: 5 },
];

// Top clientes
const topCustomers = [
  { id: 1, name: "João Silva", purchases: 8, totalSpent: 15200.50, lastPurchase: "2024-05-01" },
  { id: 2, name: "Maria Oliveira", purchases: 6, totalSpent: 9450.75, lastPurchase: "2024-05-03" },
  { id: 3, name: "Carlos Santos", purchases: 5, totalSpent: 8320.00, lastPurchase: "2024-04-28" },
  { id: 4, name: "Ana Ferreira", purchases: 4, totalSpent: 7150.25, lastPurchase: "2024-05-02" },
  { id: 5, name: "Roberto Almeida", purchases: 4, totalSpent: 6830.00, lastPurchase: "2024-04-22" },
];

// Dados financeiros por mês
const financialByMonthData = [
  { month: "Jan", revenue: 125800, expenses: 76500, profit: 49300 },
  { month: "Fev", revenue: 118400, expenses: 73200, profit: 45200 },
  { month: "Mar", revenue: 142300, expenses: 85400, profit: 56900 },
  { month: "Abr", revenue: 135600, expenses: 82100, profit: 53500 },
  { month: "Mai", revenue: 128900, expenses: 77900, profit: 51000 },
  { month: "Jun", revenue: 149500, expenses: 88700, profit: 60800 },
];

// Dados financeiros por categoria
const financialByCategoryData = [
  { name: "Vendas de Produtos", value: 75 },
  { name: "Serviços", value: 20 },
  { name: "Acessórios", value: 5 },
];

// Despesas por categoria
const expensesByCategoryData = [
  { name: "Estoque", value: 60 },
  { name: "Pessoal", value: 25 },
  { name: "Aluguel", value: 10 },
  { name: "Marketing", value: 3 },
  { name: "Outros", value: 2 },
];

// Serviços por mês
const servicesByMonthData = [
  { month: "Jan", maintenance: 25, assembly: 10, repair: 15 },
  { month: "Fev", maintenance: 22, assembly: 8, repair: 18 },
  { month: "Mar", maintenance: 28, assembly: 12, repair: 20 },
  { month: "Abr", maintenance: 24, assembly: 15, repair: 17 },
  { month: "Mai", maintenance: 20, assembly: 9, repair: 14 },
  { month: "Jun", maintenance: 30, assembly: 14, repair: 22 },
];

// Serviços por tipo
const servicesByTypeData = [
  { name: "Manutenção Regular", value: 40 },
  { name: "Reparos", value: 30 },
  { name: "Montagem", value: 20 },
  { name: "Personalização", value: 10 },
];

// Técnicos por eficiência
const technicianPerformanceData = [
  { name: "Carlos", services: 45, rating: 4.8, revenue: 12500 },
  { name: "André", services: 38, rating: 4.6, revenue: 10800 },
  { name: "Fernanda", services: 42, rating: 4.9, revenue: 11700 },
  { name: "Ricardo", services: 32, rating: 4.5, revenue: 9200 },
  { name: "Júlia", services: 29, rating: 4.7, revenue: 8400 },
];

const Reports = () => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [calendarDate, setCalendarDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-shop-primary">Relatórios</h1>
        <p className="text-muted-foreground mt-1">
          Visualize e exporte relatórios detalhados sobre seu negócio
        </p>
      </div>
      
      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Filtros</CardTitle>
          <CardDescription>Defina o período e os filtros para os relatórios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Período</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {calendarDate.from ? (
                      calendarDate.to ? (
                        <>
                          {format(calendarDate.from, "dd/MM/yyyy")} -{" "}
                          {format(calendarDate.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(calendarDate.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Selecione um período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={calendarDate.from}
                    selected={calendarDate}
                    onSelect={(range) => {
                      setCalendarDate(range || { from: undefined, to: undefined });
                      if (range?.from) {
                        setDateRange({ 
                          start: format(range.from, "yyyy-MM-dd"),
                          end: range.to ? format(range.to, "yyyy-MM-dd") : format(range.from, "yyyy-MM-dd")
                        });
                      } else {
                        setDateRange({ start: "", end: "" });
                      }
                    }}
                    numberOfMonths={2}
                    locale={ptBR}
                  />
                  <div className="p-3 border-t border-gray-100 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setCalendarDate({ from: undefined, to: undefined });
                        setDateRange({ start: "", end: "" });
                      }}
                    >
                      Limpar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        setCalendarDate({ from: today, to: today });
                        setDateRange({ 
                          start: format(today, "yyyy-MM-dd"),
                          end: format(today, "yyyy-MM-dd")
                        });
                      }}
                    >
                      Hoje
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-category">Categoria</Label>
              <Select>
                <SelectTrigger id="report-category">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="bicycles">Bicicletas</SelectItem>
                  <SelectItem value="parts">Peças</SelectItem>
                  <SelectItem value="accessories">Acessórios</SelectItem>
                  <SelectItem value="services">Serviços</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end space-x-2">
              <Button className="flex-1">
                <Filter className="mr-2 h-4 w-4" /> Aplicar Filtros
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" /> Buscar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Report Types */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="sales">
            <BarChart2 className="mr-2 h-4 w-4" />
            Vendas
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <PieChartIcon className="mr-2 h-4 w-4" />
            Estoque
          </TabsTrigger>
          <TabsTrigger value="customers">
            <Calendar className="mr-2 h-4 w-4" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="financial">
            <FileText className="mr-2 h-4 w-4" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="services">
            <FileText className="mr-2 h-4 w-4" />
            Serviços
          </TabsTrigger>
        </TabsList>
        
        {/* Relatórios de Vendas */}
        <TabsContent value="sales">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Mês</CardTitle>
                <CardDescription>Comparação de vendas mensais por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart
                    data={salesByMonthData}
                    index="month"
                    categories={["bicycles", "parts", "accessories"]}
                    colors={["#f97316", "#94a3b8", "#64748b"]}
                    valueFormatter={(value) => `${value} unid.`}
                    customTooltip={({ payload }) => {
                      if (payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="font-medium">{payload[0].payload.month}</div>
                            {payload.map((entry, index) => (
                              <div
                                key={`item-${index}`}
                                className="flex items-center text-xs gap-2"
                              >
                                <div
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="font-medium capitalize">
                                  {entry.name === "bicycles" ? "Bicicletas" :
                                   entry.name === "parts" ? "Peças" : "Acessórios"}:
                                </span>
                                <span>{entry.value} unid.</span>
                              </div>
                            ))}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Exportar
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Vendas por Categoria</CardTitle>
                <CardDescription>Percentual de vendas por tipo de produto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PieChart
                    data={salesByCategoryData}
                    index="name"
                    categories={["value"]}
                    colors={["#f97316", "#94a3b8", "#64748b", "#475569"]}
                    valueFormatter={(value) => `${value}%`}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Exportar
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Top Selling Products */}
          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
              <CardDescription>Os 5 produtos com maior volume de vendas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Produto</th>
                      <th className="text-center py-3 px-4 font-medium">Quantidade Vendida</th>
                      <th className="text-right py-3 px-4 font-medium">Faturamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSellingProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{product.name}</td>
                        <td className="py-3 px-4 text-center">{product.quantity} unid.</td>
                        <td className="py-3 px-4 text-right">R$ {product.revenue.toLocaleString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Ver Todos</Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Exportar
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Relatórios de Estoque */}
        <TabsContent value="inventory">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Estoque por Categoria</CardTitle>
                <CardDescription>Comparação entre estoque atual, mínimo e máximo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart
                    data={inventoryData}
                    index="category"
                    categories={["inStock", "minStock", "maxStock"]}
                    colors={["#3b82f6", "#ef4444", "#84cc16"]}
                    valueFormatter={(value) => `${value} unid.`}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Exportar
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Giro de Estoque</CardTitle>
                <CardDescription>Taxa de rotatividade por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <LineChart
                    data={stockTurnoverData}
                    index="month"
                    categories={["turnover"]}
                    colors={["#0ea5e9"]}
                    valueFormatter={(value) => `${value}x`}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Exportar
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Produtos com Estoque Baixo */}
          <Card>
            <CardHeader>
              <CardTitle>Produtos com Estoque Baixo</CardTitle>
              <CardDescription>Produtos abaixo do estoque mínimo recomendado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Produto</th>
                      <th className="text-left py-3 px-4 font-medium">Categoria</th>
                      <th className="text-center py-3 px-4 font-medium">Estoque Atual</th>
                      <th className="text-center py-3 px-4 font-medium">Estoque Mínimo</th>
                      <th className="text-center py-3 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{product.name}</td>
                        <td className="py-3 px-4">{product.category}</td>
                        <td className="py-3 px-4 text-center">{product.inStock} unid.</td>
                        <td className="py-3 px-4 text-center">{product.minStock} unid.</td>
                        <td className="py-3 px-4 text-center">
                          {product.inStock === 0 ? (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                              Sem Estoque
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                              Estoque Baixo
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Ver Todos</Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Exportar
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Relatórios de Clientes */}
        <TabsContent value="customers">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Clientes por Mês</CardTitle>
                <CardDescription>Novos clientes vs. clientes recorrentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart
                    data={customersByMonthData}
                    index="month"
                    categories={["new", "returning"]}
                    colors={["#f97316", "#3b82f6"]}
                    valueFormatter={(value) => `${value} clientes`}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Exportar
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Clientes por Região</CardTitle>
                <CardDescription>Distribuição geográfica dos clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PieChart
                    data={customersByRegionData}
                    index="name"
                    categories={["value"]}
                    colors={["#f97316", "#3b82f6", "#22c55e", "#eab308", "#a855f7"]}
                    valueFormatter={(value) => `${value}%`}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Exportar
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Top Customers */}
          <Card>
            <CardHeader>
              <CardTitle>Principais Clientes</CardTitle>
              <CardDescription>Os 5 clientes com maior valor em compras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Cliente</th>
                      <th className="text-center py-3 px-4 font-medium">Compras</th>
                      <th className="text-right py-3 px-4 font-medium">Total Gasto</th>
                      <th className="text-center py-3 px-4 font-medium">Última Compra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{customer.name}</td>
                        <td className="py-3 px-4 text-center">{customer.purchases}</td>
                        <td className="py-3 px-4 text-right">R$ {customer.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-4 text-center">{format(new Date(customer.lastPurchase), "dd/MM/yyyy")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Ver Todos</Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Exportar
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Relatórios Financeiros */}
        <TabsContent value="financial">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho Financeiro Mensal</CardTitle>
                <CardDescription>Receita, despesas e lucro por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart
                    data={financialByMonthData}
                    index="month"
                    categories={["revenue", "expenses", "profit"]}
                    colors={["#22c55e", "#ef4444", "#3b82f6"]}
                    valueFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Exportar
                </Button>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Receita por Categoria</CardTitle>
                  <CardDescription>Distribuição de receitas por tipo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[180px]">
                    <PieChart
                      data={financialByCategoryData}
                      index="name"
                      categories={["value"]}
                      colors={["#22c55e", "#3b82f6", "#f97316"]}
                      valueFormatter={(value) => `${value}%`}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Despesas por Categoria</CardTitle>
                  <CardDescription>Distribuição de despesas por tipo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[180px]">
                    <PieChart
                      data={expensesByCategoryData}
                      index="name"
                      categories={["value"]}
                      colors={["#ef4444", "#f97316", "#eab308", "#a855f7", "#64748b"]}
                      valueFormatter={(value) => `${value}%`}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro Mensal</CardTitle>
              <CardDescription>Detalhamento dos principais indicadores financeiros</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Mês</th>
                      <th className="text-right py-3 px-4 font-medium">Receita</th>
                      <th className="text-right py-3 px-4 font-medium">Despesas</th>
                      <th className="text-right py-3 px-4 font-medium">Lucro</th>
                      <th className="text-right py-3 px-4 font-medium">Margem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialByMonthData.map((data, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{data.month}</td>
                        <td className="py-3 px-4 text-right">R$ {data.revenue.toLocaleString('pt-BR')}</td>
                        <td className="py-3 px-4 text-right">R$ {data.expenses.toLocaleString('pt-BR')}</td>
                        <td className="py-3 px-4 text-right font-medium">R$ {data.profit.toLocaleString('pt-BR')}</td>
                        <td className="py-3 px-4 text-right">{((data.profit / data.revenue) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30 font-medium">
                      <td className="py-3 px-4">Total</td>
                      <td className="py-3 px-4 text-right">
                        R$ {financialByMonthData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        R$ {financialByMonthData.reduce((sum, item) => sum + item.expenses, 0).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        R$ {financialByMonthData.reduce((sum, item) => sum + item.profit, 0).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {((financialByMonthData.reduce((sum, item) => sum + item.profit, 0) / 
                           financialByMonthData.reduce((sum, item) => sum + item.revenue, 0)) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Exportar
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Relatórios de Serviços */}
        <TabsContent value="services">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Serviços por Mês</CardTitle>
                <CardDescription>Distribuição de serviços por tipo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart
                    data={servicesByMonthData}
                    index="month"
                    categories={["maintenance", "assembly", "repair"]}
                    colors={["#3b82f6", "#f97316", "#a855f7"]}
                    valueFormatter={(value) => `${value} serviços`}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Exportar
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Serviços por Tipo</CardTitle>
                <CardDescription>Percentual por categoria de serviço</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PieChart
                    data={servicesByTypeData}
                    index="name"
                    categories={["value"]}
                    colors={["#3b82f6", "#a855f7", "#f97316", "#22c55e"]}
                    valueFormatter={(value) => `${value}%`}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Exportar
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Technician Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Desempenho de Técnicos</CardTitle>
              <CardDescription>Comparação de produtividade e avaliações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Técnico</th>
                      <th className="text-center py-3 px-4 font-medium">Serviços Realizados</th>
                      <th className="text-center py-3 px-4 font-medium">Avaliação</th>
                      <th className="text-right py-3 px-4 font-medium">Receita Gerada</th>
                      <th className="text-center py-3 px-4 font-medium">Eficiência</th>
                    </tr>
                  </thead>
                  <tbody>
                    {technicianPerformanceData.map((tech, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{tech.name}</td>
                        <td className="py-3 px-4 text-center">{tech.services}</td>
                        <td className="py-3 px-4 text-center">{tech.rating} / 5.0</td>
                        <td className="py-3 px-4 text-right">R$ {tech.revenue.toLocaleString('pt-BR')}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-green-600 h-2.5 rounded-full" 
                                style={{ width: `${(tech.rating / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Exportar
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
