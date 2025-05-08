
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  ShoppingCart, 
  Wrench, 
  Package, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Bike
} from "lucide-react";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const Dashboard = () => {
  // Mock data
  const salesData = [
    { name: "Jan", value: 4000 },
    { name: "Fev", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Abr", value: 4500 },
    { name: "Mai", value: 6000 },
    { name: "Jun", value: 5500 },
  ];

  const servicesData = [
    { name: "Revisão", value: 35 },
    { name: "Reparo", value: 25 },
    { name: "Montagem", value: 20 },
    { name: "Ajustes", value: 15 },
    { name: "Outros", value: 5 },
  ];

  const COLORS = ["#FF6B00", "#FF8A30", "#FFA559", "#FFBB80", "#FFD6B0"];

  const upcomingServices = [
    { id: 1, customer: "João Silva", service: "Revisão completa", date: "Hoje" },
    { id: 2, customer: "Maria Oliveira", service: "Troca de pneus", date: "Amanhã" },
    { id: 3, customer: "Carlos Santos", service: "Ajuste de câmbio", date: "27/05/2024" },
  ];

  const lowStockItems = [
    { id: 1, name: "Câmara aro 26", quantity: 3, min: 5 },
    { id: 2, name: "Corrente KMC 8v", quantity: 2, min: 5 },
    { id: 3, name: "Cabo de freio", quantity: 4, min: 10 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/5d69e1f9-27a3-4d17-b3f0-f81f3177fc9f.png" 
            alt="Ciclo Alarico" 
            className="h-10"
          />
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-shop-primary/10 p-3 rounded-full mr-4">
              <ShoppingCart size={24} className="text-shop-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Vendas Hoje</p>
              <h3 className="text-2xl font-bold">R$ 2.450,00</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-shop-secondary/10 p-3 rounded-full mr-4">
              <Wrench size={24} className="text-shop-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Serviços Ativos</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-shop-accent/10 p-3 rounded-full mr-4">
              <Users size={24} className="text-shop-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Novos Clientes</p>
              <h3 className="text-2xl font-bold">5</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <AlertTriangle size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Itens em Baixa</p>
              <h3 className="text-2xl font-bold">8</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vendas dos Últimos 6 Meses</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value}`, "Valor"]} />
                <Bar dataKey="value" fill="#FF6B00" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tipos de Serviços</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={servicesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {servicesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Percentual"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Próximos Serviços
            </CardTitle>
            <a href="/services" className="text-sm text-shop-primary hover:underline">
              Ver todos
            </a>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 bg-shop-light rounded-md"
                >
                  <div>
                    <p className="font-medium">{service.customer}</p>
                    <p className="text-sm text-gray-600">{service.service}</p>
                  </div>
                  <div className="text-sm font-medium bg-shop-primary/10 text-shop-primary py-1 px-3 rounded">
                    {service.date}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Itens com Estoque Baixo
            </CardTitle>
            <a href="/inventory" className="text-sm text-shop-primary hover:underline">
              Ver todos
            </a>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-shop-light rounded-md"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Mínimo: {item.min}
                    </p>
                  </div>
                  <div className="text-sm font-medium bg-red-100 text-red-600 py-1 px-3 rounded">
                    Atual: {item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
