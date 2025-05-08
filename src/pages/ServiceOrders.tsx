import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus } from "lucide-react";
import ServiceOrderCard from "@/components/service-orders/ServiceOrderCard";
import ServiceOrderForm from "@/components/service-orders/ServiceOrderForm";
import ServiceOrderDetails from "@/components/service-orders/ServiceOrderDetails";
import { ServiceStatusType } from "@/components/service-orders/ServiceStatus";
import { Product } from "@/types";

// Mock data for service orders
const initialServiceOrders = [
  {
    id: "OS2024001",
    customer: "João Silva",
    bikeModel: "Mountain Bike Trek X-Caliber 8",
    issueDescription: "Freios fazendo barulho e sem força",
    status: "Em andamento" as ServiceStatusType,
    priority: "Normal" as "Normal",
    createdAt: "2024-05-01",
    scheduledFor: "2024-05-05",
    completedAt: null,
    technician: "Carlos Oliveira",
    services: [
      { id: 1, name: "Regulagem de freios", price: 60.00 }
    ],
    products: [
      { id: 1, name: "Pastilha de freio Shimano", quantity: 2, price: 89.90, subtotal: 179.80 }
    ],
    totalPrice: 239.80,
    notes: "Cliente solicitou revisão dos câmbios também."
  },
  {
    id: "OS2024002",
    customer: "Maria Oliveira",
    bikeModel: "Caloi Elite Carbon",
    issueDescription: "Revisão geral para viagem",
    status: "Concluída" as ServiceStatusType,
    priority: "Alta",
    createdAt: "2024-05-02",
    scheduledFor: "2024-05-04",
    completedAt: "2024-05-04",
    technician: "Carlos Oliveira",
    services: [
      { id: 1, name: "Revisão completa", price: 180.00 },
      { id: 2, name: "Troca de óleo de suspensão", price: 150.00 }
    ],
    products: [
      { id: 1, name: "Óleo suspensão 10w", quantity: 1, price: 120.00, subtotal: 120.00 },
      { id: 2, name: "Lubrificante de corrente", quantity: 1, price: 39.90, subtotal: 39.90 }
    ],
    totalPrice: 489.90,
    notes: "Fazer teste de rua após revisão."
  },
  {
    id: "OS2024003",
    customer: "Roberto Almeida",
    bikeModel: "Speed Specialized Tarmac",
    issueDescription: "Troca de grupo de câmbio",
    status: "Aguardando peças" as ServiceStatusType,
    priority: "Normal",
    createdAt: "2024-05-03",
    scheduledFor: "2024-05-10",
    completedAt: null,
    technician: "André Santos",
    services: [
      { id: 1, name: "Instalação grupo completo", price: 250.00 }
    ],
    products: [
      { id: 1, name: "Grupo Shimano 105", quantity: 1, price: 2500.00, subtotal: 2500.00 }
    ],
    totalPrice: 2750.00,
    notes: "Cliente vai trazer as peças."
  },
  {
    id: "OS2024004",
    customer: "Ana Ferreira",
    bikeModel: "Cannondale Trail 5",
    issueDescription: "Barulho estranho ao pedalar",
    status: "Aberta" as ServiceStatusType,
    priority: "Normal",
    createdAt: "2024-05-06",
    scheduledFor: "2024-05-08",
    completedAt: null,
    technician: null,
    services: [],
    products: [],
    totalPrice: 0,
    notes: "Agendar diagnóstico."
  },
  {
    id: "OS2024005",
    customer: "Carlos Santos",
    bikeModel: "BMX Mongoose Legion",
    issueDescription: "Troca de pneu e câmara",
    status: "Em andamento" as ServiceStatusType,
    priority: "Baixa",
    createdAt: "2024-05-05",
    scheduledFor: "2024-05-07",
    completedAt: null,
    technician: "André Santos",
    services: [
      { id: 1, name: "Troca de pneu e câmara", price: 50.00 }
    ],
    products: [
      { id: 1, name: "Pneu BMX 20\"", quantity: 1, price: 89.90, subtotal: 89.90 },
      { id: 2, name: "Câmara BMX 20\"", quantity: 1, price: 29.90, subtotal: 29.90 }
    ],
    totalPrice: 169.80,
    notes: ""
  },
];

// Priority options
const priorityOptions = [
  { value: "Baixa", label: "Baixa" },
  { value: "Normal", label: "Normal" },
  { value: "Alta", label: "Alta" },
  { value: "Urgente", label: "Urgente" },
];

// Sample service options
const serviceOptions = [
  { id: 1, name: "Revisão básica", price: 100.00 },
  { id: 2, name: "Revisão completa", price: 180.00 },
  { id: 3, name: "Regulagem de freios", price: 60.00 },
  { id: 4, name: "Regulagem de câmbio", price: 70.00 },
  { id: 5, name: "Troca de óleo de suspensão", price: 150.00 },
  { id: 6, name: "Alinhamento de rodas", price: 80.00 },
  { id: 7, name: "Troca de pneu e câmara", price: 50.00 },
  { id: 8, name: "Instalação grupo completo", price: 250.00 },
];

// Sample product options - Make sure they match the Product interface
const productOptions: Product[] = [
  { id: 1, name: "Pneu MTB 29\"", price: 129.90, stock: 10, quantity: 0 },
  { id: 2, name: "Câmara aro 29", price: 29.90, stock: 15, quantity: 0 },
  { id: 3, name: "Pastilha de freio Shimano", price: 89.90, stock: 8, quantity: 0 },
  { id: 4, name: "Óleo suspensão 10w", price: 120.00, stock: 5, quantity: 0 },
  { id: 5, name: "Lubrificante de corrente", price: 39.90, stock: 20, quantity: 0 },
];

// Sample customers
const customerOptions = [
  { id: 1, name: "João Silva" },
  { id: 2, name: "Maria Oliveira" },
  { id: 3, name: "Roberto Almeida" },
  { id: 4, name: "Ana Ferreira" },
  { id: 5, name: "Carlos Santos" },
];

// Sample technicians
const technicianOptions = [
  { id: 1, name: "Carlos Oliveira" },
  { id: 2, name: "André Santos" },
  { id: 3, name: "Fernanda Lima" },
];

const ServiceOrders = () => {
  const { toast } = useToast();
  const [serviceOrders, setServiceOrders] = useState(initialServiceOrders);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedServiceOrder, setSelectedServiceOrder] = useState<any>(null);

  // Filtrar ordens de serviço
  const filteredServiceOrders = serviceOrders.filter((order) => {
    // Filter by search term
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.bikeModel.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab
    if (activeTab === "all") {
      return matchesSearch;
    } else if (activeTab === "pending") {
      return matchesSearch && ["Aberta", "Em andamento", "Aguardando peças"].includes(order.status);
    } else if (activeTab === "completed") {
      return matchesSearch && ["Concluída", "Entregue"].includes(order.status);
    }
    
    return matchesSearch;
  });

  // Manipular visualização de uma ordem de serviço
  const handleViewServiceOrder = (order: any) => {
    setSelectedServiceOrder(order);
    setIsViewDialogOpen(true);
  };

  // Manipular criação de uma nova ordem de serviço
  const handleCreateServiceOrder = (data: any) => {
    const orderCount = serviceOrders.length;
    const newOrder = {
      id: `OS2024${String(orderCount + 1).padStart(3, "0")}`,
      customer: data.customer,
      bikeModel: data.bikeModel,
      issueDescription: data.issueDescription,
      status: "Aberta" as ServiceStatusType,
      priority: data.priority as "Baixa" | "Normal" | "Alta" | "Urgente",
      createdAt: new Date().toISOString().split("T")[0],
      scheduledFor: data.scheduledFor,
      completedAt: null,
      technician: data.technicianId ? technicianOptions.find(t => t.id === parseInt(data.technicianId))?.name : null,
      services: data.services,
      products: data.products,
      totalPrice: data.totalPrice,
      notes: data.notes,
    };

    setServiceOrders([...serviceOrders, newOrder]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Ordem de serviço criada",
      description: `OS ${newOrder.id} foi criada com sucesso.`,
    });
  };

  // Atualizar status da ordem de serviço
  const handleUpdateStatus = (orderId: string, newStatus: ServiceStatusType) => {
    const updatedOrders = serviceOrders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus };
        if (newStatus === "Concluída" || newStatus === "Entregue") {
          updatedOrder.completedAt = new Date().toISOString().split("T")[0];
        }
        return updatedOrder;
      }
      return order;
    });

    setServiceOrders(updatedOrders);
    setIsViewDialogOpen(false);
    
    toast({
      title: "Status atualizado",
      description: `A ordem de serviço ${orderId} foi atualizada para "${newStatus}".`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ordens de Serviço</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus size={16} /> Nova OS
            </Button>
          </DialogTrigger>
          <ServiceOrderForm
            isOpen={isAddDialogOpen}
            onClose={() => setIsAddDialogOpen(false)}
            onSubmit={handleCreateServiceOrder}
            customers={customerOptions}
            serviceOptions={serviceOptions}
            productOptions={productOptions}
            technicianOptions={technicianOptions}
            priorityOptions={priorityOptions}
          />
        </Dialog>
      </div>

      <div className="flex items-center border rounded-md px-3 py-2">
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        <Input
          placeholder="Buscar por número, cliente ou bicicleta..."
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4 mt-4">
          {renderServiceOrderCards()}
        </TabsContent>
        <TabsContent value="pending" className="space-y-4 mt-4">
          {renderServiceOrderCards()}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4 mt-4">
          {renderServiceOrderCards()}
        </TabsContent>
      </Tabs>

      {/* View service order dialog */}
      <ServiceOrderDetails
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        order={selectedServiceOrder}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );

  // Renderizar cards de ordens de serviço
  function renderServiceOrderCards() {
    if (filteredServiceOrders.length === 0) {
      return (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-100">
          <div className="text-gray-500">Nenhuma ordem de serviço encontrada</div>
        </div>
      );
    }

    return filteredServiceOrders.map((order) => (
      <ServiceOrderCard 
        key={order.id} 
        order={order} 
        onViewDetails={handleViewServiceOrder} 
      />
    ));
  }
};

export default ServiceOrders;
