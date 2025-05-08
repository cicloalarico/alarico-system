
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/ui/charts";
import { Download, FileText, Search, Filter, Calendar, BarChart2, PieChart as PieChartIcon } from "lucide-react";

// Mock data for the charts
const salesByMonthData = [
  { month: "Jan", bicycles: 42, parts: 85, accessories: 63 },
  { month: "Fev", bicycles: 38, parts: 73, accessories: 51 },
  { month: "Mar", bicycles: 45, parts: 102, accessories: 79 },
  { month: "Abr", bicycles: 53, parts: 94, accessories: 68 },
  { month: "Mai", bicycles: 47, parts: 88, accessories: 72 },
  { month: "Jun", bicycles: 51, parts: 105, accessories: 81 },
];

const salesByCategoryData = [
  { name: "Bicicletas", value: 45 },
  { name: "Peças", value: 30 },
  { name: "Acessórios", value: 15 },
  { name: "Serviços", value: 10 },
];

const topSellingProducts = [
  { id: 1, name: "Mountain Bike Pro X1", quantity: 24, revenue: 72000 },
  { id: 2, name: "Capacete Speed Elite", quantity: 45, revenue: 13500 },
  { id: 3, name: "Câmara de Ar Aro 29", quantity: 120, revenue: 3600 },
  { id: 4, name: "Luva Ciclismo Gel", quantity: 87, revenue: 4350 },
  { id: 5, name: "Bicicleta Urbana City", quantity: 18, revenue: 32400 },
];

const Reports = () => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-shop-primary">Relatórios</h1>
        <p className="text-muted-foreground mt-1">
          Visualize e exporte relatórios detalhados sobre seu negócio
        </p>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Filtros</CardTitle>
          <CardDescription>Defina o período e os filtros para os relatórios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Data Inicial</Label>
              <Input 
                id="start-date" 
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Data Final</Label>
              <Input 
                id="end-date" 
                type="date" 
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              />
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
        </TabsList>
        
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
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Controle de Estoque</CardTitle>
              <CardDescription>Esta seção será implementada em breve...</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex items-center justify-center flex-col">
              <div className="bg-muted rounded-full p-6 mb-4">
                <PieChartIcon className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">Relatórios de Estoque</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Aqui você poderá visualizar relatórios detalhados sobre movimentação de estoque, 
                produtos com estoque baixo, e giro de mercadoria.
              </p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline" disabled>Disponível em Breve</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Clientes</CardTitle>
              <CardDescription>Esta seção será implementada em breve...</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex items-center justify-center flex-col">
              <div className="bg-muted rounded-full p-6 mb-4">
                <Calendar className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">Relatórios de Clientes</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Aqui você poderá analisar padrões de compra dos clientes, frequência de visitas,
                e histórico detalhado de cada cliente.
              </p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline" disabled>Disponível em Breve</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Financeiros</CardTitle>
              <CardDescription>Esta seção será implementada em breve...</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex items-center justify-center flex-col">
              <div className="bg-muted rounded-full p-6 mb-4">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">Relatórios Financeiros</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Aqui você poderá acessar relatórios financeiros detalhados, incluindo
                fluxo de caixa, DRE, balanço financeiro e muito mais.
              </p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline" disabled>Disponível em Breve</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
