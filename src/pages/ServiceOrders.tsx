import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  Bike, 
  FileCheck,
  CheckCircle2, 
  AlertCircle,
  ClockIcon,
  CheckCircle,
  Printer,
  ArrowRight,
  Package,
  Wrench,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for service orders
const initialServiceOrders = [
  {
    id: "OS2024001",
    customer: "João Silva",
    bikeModel: "Mountain Bike Trek X-Caliber 8",
    issueDescription: "Freios fazendo barulho e sem força",
    status: "Em andamento",
    priority: "Normal",
    createdAt: "2024-05-01",
    scheduledFor: "2024-05-05",
    completedAt: null,
    technician: "Carlos Oliveira",
    services: [
      { id: 1, name: "Regulagem de freios", price: 60.00 }
    ],
    products: [
      { id: 1, name: "Pastilha de freio Shimano", quantity: 2, price: 89.90 }
    ],
    totalPrice: 239.80,
    notes: "Cliente solicitou revisão dos câmbios também."
  },
  {
    id: "OS2024002",
    customer: "Maria Oliveira",
    bikeModel: "Caloi Elite Carbon",
    issueDescription: "Revisão geral para viagem",
    status: "Concluído",
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
      { id: 1, name: "Óleo suspensão 10w", quantity: 1, price: 120.00 },
      { id: 2, name: "Lubrificante de corrente", quantity: 1, price: 39.90 }
    ],
    totalPrice: 489.90,
    notes: "Fazer teste de rua após revisão."
  },
  {
    id: "OS2024003",
    customer: "Roberto Almeida",
    bikeModel: "Speed Specialized Tarmac",
    issueDescription: "Troca de grupo de câmbio",
    status: "Aguardando peças",
    priority: "Normal",
    createdAt: "2024-05-03",
    scheduledFor: "2024-05-10",
    completedAt: null,
    technician: "André Santos",
    services: [
      { id: 1, name: "Instalação grupo completo", price: 250.00 }
    ],
    products: [
      { id: 1, name: "Grupo Shimano 105", quantity: 1, price: 2500.00 }
    ],
    totalPrice: 2750.00,
    notes: "Cliente vai trazer as peças."
  },
  {
    id: "OS2024004",
    customer: "Ana Ferreira",
    bikeModel: "Cannondale Trail 5",
    issueDescription: "Barulho estranho ao pedalar",
    status: "Aberta",
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
    status: "Em andamento",
    priority: "Baixa",
    createdAt: "2024-05-05",
    scheduledFor: "2024-05-07",
    completedAt: null,
    technician: "André Santos",
    services: [
      { id: 1, name: "Troca de pneu e câmara", price: 50.00 }
    ],
    products: [
      { id: 1, name: "Pneu BMX 20\"", quantity: 1, price: 89.90 },
      { id: 2, name: "Câmara BMX 20\"", quantity: 1, price: 29.90 }
    ],
    totalPrice: 169.80,
    notes: ""
  },
];

// Service status options with colors
const statusOptions = [
  { value: "Aberta", label: "Aberta", color: "bg-blue-100 text-blue-800" },
  { value: "Em andamento", label: "Em andamento", color: "bg-amber-100 text-amber-800" },
  { value: "Aguardando peças", label: "Aguardando peças", color: "bg-purple-100 text-purple-800" },
  { value: "Concluído", label: "Concluído", color: "bg-green-100 text-green-800" },
  { value: "Entregue", label: "Entregue", color: "bg-gray-100 text-gray-800" },
  { value: "Cancelado", label: "Cancelado", color: "bg-red-100 text-red-800" },
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

// Sample product options
const productOptions = [
  { id: 1, name: "Pneu MTB 29\"", price: 129.90, stock: 10 },
  { id: 2, name: "Câmara aro 29", price: 29.90, stock: 15 },
  { id: 3, name: "Pastilha de freio Shimano", price: 89.90, stock: 8 },
  { id: 4, name: "Óleo suspensão 10w", price: 120.00, stock: 5 },
  { id: 5, name: "Lubrificante de corrente", price: 39.90, stock: 20 },
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

  // New service order form state
  const [newServiceOrder, setNewServiceOrder] = useState({
    customer: "",
    bikeModel: "",
    issueDescription: "",
    priority: "Normal",
    scheduledFor: new Date().toISOString().split("T")[0],
    notes: "",
    services: [] as any[],
    products: [] as any[],
  });

  // Temporary items for adding to order
  const [selectedService, setSelectedService] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productQuantity, setProductQuantity] = useState(1);

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
      return matchesSearch && ["Concluído", "Entregue"].includes(order.status);
    }
    
    return matchesSearch;
  });

  // Calculate total price of the new service order
  const calculateTotalPrice = () => {
    let servicesTotal = newServiceOrder.services.reduce(
      (sum, service) => sum + service.price,
      0
    );
    let productsTotal = newServiceOrder.products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    return servicesTotal + productsTotal;
  };

  const handleAddService = () => {
    if (!selectedService) return;
    
    const service = serviceOptions.find(s => s.name === selectedService);
    if (service) {
      const newServices = [...newServiceOrder.services, { ...service }];
      setNewServiceOrder({
        ...newServiceOrder,
        services: newServices,
      });
      setSelectedService("");
    }
  };

  const handleAddProduct = () => {
    if (!selectedProduct || productQuantity <= 0) return;
    
    const product = productOptions.find(p => p.name === selectedProduct);
    if (product) {
      const newProducts = [...newServiceOrder.products, { 
        ...product, 
        quantity: productQuantity 
      }];
      setNewServiceOrder({
        ...newServiceOrder,
        products: newProducts,
      });
      setSelectedProduct("");
      setProductQuantity(1);
    }
  };

  const handleRemoveService = (id: number) => {
    setNewServiceOrder({
      ...newServiceOrder,
      services: newServiceOrder.services.filter(s => s.id !== id),
    });
  };

  const handleRemoveProduct = (id: number) => {
    setNewServiceOrder({
      ...newServiceOrder,
      products: newServiceOrder.products.filter(p => p.id !== id),
    });
  };

  const handleCreateServiceOrder = () => {
    if (!newServiceOrder.customer || !newServiceOrder.bikeModel || !newServiceOrder.issueDescription) {
      toast({
        title: "Erro ao criar ordem de serviço",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const totalPrice = calculateTotalPrice();
    const orderCount = serviceOrders.length;
    const newOrder = {
      id: `OS2024${String(orderCount + 1).padStart(3, "0")}`,
      customer: newServiceOrder.customer,
      bikeModel: newServiceOrder.bikeModel,
      issueDescription: newServiceOrder.issueDescription,
      status: "Aberta",
      priority: newServiceOrder.priority,
      createdAt: new Date().toISOString().split("T")[0],
      scheduledFor: newServiceOrder.scheduledFor,
      completedAt: null,
      technician: null,
      services: newServiceOrder.services,
      products: newServiceOrder.products,
      totalPrice,
      notes: newServiceOrder.notes,
    };

    setServiceOrders([...serviceOrders, newOrder]);
    setIsAddDialogOpen(false);
    
    // Reset form
    setNewServiceOrder({
      customer: "",
      bikeModel: "",
      issueDescription: "",
      priority: "Normal",
      scheduledFor: new Date().toISOString().split("T")[0],
      notes: "",
      services: [],
      products: [],
    });
    
    toast({
      title: "Ordem de serviço criada",
      description: `OS ${newOrder.id} foi criada com sucesso.`,
    });
  };

  const handleViewServiceOrder = (order: any) => {
    setSelectedServiceOrder(order);
    setIsViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return (
      <Badge className={statusOption?.color}>
        {status}
      </Badge>
    );
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
          <DialogContent className="sm:max-w-2xl h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Ordem de Serviço</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Cliente *</Label>
                  <Select 
                    value={newServiceOrder.customer} 
                    onValueChange={(value) => setNewServiceOrder({...newServiceOrder, customer: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {customerOptions.map((customer) => (
                        <SelectItem key={customer.id} value={customer.name}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select 
                    value={newServiceOrder.priority} 
                    onValueChange={(value) => setNewServiceOrder({...newServiceOrder, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bikeModel">Bicicleta (Marca/Modelo) *</Label>
                  <Input
                    id="bikeModel"
                    value={newServiceOrder.bikeModel}
                    onChange={(e) => setNewServiceOrder({...newServiceOrder, bikeModel: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledFor">Data Agendada</Label>
                  <Input
                    id="scheduledFor"
                    type="date"
                    value={newServiceOrder.scheduledFor}
                    onChange={(e) => setNewServiceOrder({...newServiceOrder, scheduledFor: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueDescription">Descrição do Problema *</Label>
                <Textarea
                  id="issueDescription"
                  value={newServiceOrder.issueDescription}
                  onChange={(e) => setNewServiceOrder({...newServiceOrder, issueDescription: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-4 flex items-center">
                  <Wrench className="h-5 w-5 mr-2" />
                  Serviços
                </h3>

                <div className="flex items-end gap-2 mb-4">
                  <div className="flex-1">
                    <Label htmlFor="service" className="mb-2 block">
                      Adicionar Serviço
                    </Label>
                    <Select
                      value={selectedService}
                      onValueChange={setSelectedService}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceOptions.map((service) => (
                          <SelectItem key={service.id} value={service.name}>
                            {service.name} - R$ {service.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="button" onClick={handleAddService}>
                    Adicionar
                  </Button>
                </div>

                {newServiceOrder.services.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Serviço</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {newServiceOrder.services.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell>{service.name}</TableCell>
                            <TableCell className="text-right">
                              R$ {service.price.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveService(service.id)}
                                className="h-8 w-8"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50 border rounded-md text-gray-500">
                    Nenhum serviço adicionado
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Peças e Produtos
                </h3>

                <div className="flex items-end gap-2 mb-4">
                  <div className="flex-1">
                    <Label htmlFor="product" className="mb-2 block">
                      Adicionar Produto
                    </Label>
                    <Select
                      value={selectedProduct}
                      onValueChange={setSelectedProduct}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {productOptions.map((product) => (
                          <SelectItem key={product.id} value={product.name}>
                            {product.name} - R$ {product.price.toFixed(2)} (Estoque: {product.stock})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24">
                    <Label htmlFor="quantity" className="mb-2 block">
                      Qtd
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      id="quantity"
                      value={productQuantity}
                      onChange={(e) => setProductQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <Button type="button" onClick={handleAddProduct}>
                    Adicionar
                  </Button>
                </div>

                {newServiceOrder.products.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead className="w-20 text-center">Qtd</TableHead>
                          <TableHead className="text-right">Valor Unit.</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {newServiceOrder.products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell className="text-center">
                              {product.quantity}
                            </TableCell>
                            <TableCell className="text-right">
                              R$ {product.price.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              R$ {(product.quantity * product.price).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveProduct(product.id)}
                                className="h-8 w-8"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50 border rounded-md text-gray-500">
                    Nenhum produto adicionado
                  </div>
                )}
              </div>

              <div className="space-y-2 border-t pt-4">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={newServiceOrder.notes}
                  onChange={(e) => setNewServiceOrder({...newServiceOrder, notes: e.target.value})}
                  rows={2}
                />
              </div>

              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>R$ {calculateTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateServiceOrder}>
                Criar Ordem de Serviço
              </Button>
            </DialogFooter>
          </DialogContent>
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
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>OS: {selectedServiceOrder?.id}</span>
              {selectedServiceOrder && getStatusBadge(selectedServiceOrder.status)}
            </DialogTitle>
          </DialogHeader>
          {selectedServiceOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <User className="h-4 w-4 mr-1" /> Cliente
                    </h3>
                    <p className="font-medium">{selectedServiceOrder.customer}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <Bike className="h-4 w-4 mr-1" /> Bicicleta
                    </h3>
                    <p>{selectedServiceOrder.bikeModel}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" /> Problema Relatado
                    </h3>
                    <p>{selectedServiceOrder.issueDescription}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" /> Datas
                    </h3>
                    <p>Abertura: {selectedServiceOrder.createdAt}</p>
                    <p>Agendamento: {selectedServiceOrder.scheduledFor}</p>
                    {selectedServiceOrder.completedAt && (
                      <p>Conclusão: {selectedServiceOrder.completedAt}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <User className="h-4 w-4 mr-1" /> Técnico
                    </h3>
                    <p>{selectedServiceOrder.technician || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Prioridade</h3>
                    <p>{selectedServiceOrder.priority}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Serviços</h3>
                {selectedServiceOrder.services.length > 0 ? (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Serviço</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedServiceOrder.services.map((service: any) => (
                          <TableRow key={service.id}>
                            <TableCell>{service.name}</TableCell>
                            <TableCell className="text-right">
                              R$ {service.price.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhum serviço registrado</p>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Produtos</h3>
                {selectedServiceOrder.products.length > 0 ? (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead className="w-20 text-center">Qtd</TableHead>
                          <TableHead className="text-right">Valor Unit.</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedServiceOrder.products.map((product: any) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell className="text-center">
                              {product.quantity}
                            </TableCell>
                            <TableCell className="text-right">
                              R$ {product.price.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              R$ {(product.quantity * product.price).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhum produto registrado</p>
                )}
              </div>

              {selectedServiceOrder.notes && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Observações</h3>
                  <p>{selectedServiceOrder.notes}</p>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-md mt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>R$ {selectedServiceOrder.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Fechar
                </Button>
                <Button className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Imprimir OS
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );

  function renderServiceOrderCards() {
    if (filteredServiceOrders.length === 0) {
      return (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-100">
          <div className="text-gray-500">Nenhuma ordem de serviço encontrada</div>
        </div>
      );
    }

    return filteredServiceOrders.map((order) => (
      <Card key={order.id} className="overflow-hidden">
        <CardHeader className="bg-gray-50 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {order.id}
                {order.priority === "Alta" && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    Prioridade Alta
                  </span>
                )}
                {order.priority === "Urgente" && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                    URGENTE
                  </span>
                )}
              </CardTitle>
              <CardDescription>{order.customer}</CardDescription>
            </div>
            {getStatusBadge(order.status)}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Bike className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-700">{order.bikeModel}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-700">Agendado para: {order.scheduledFor}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-700">Aberto em: {order.createdAt}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-700">
                <span className="font-medium">Problema relatado:</span> {order.issueDescription}
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center text-sm">
                  {order.status === "Em andamento" && (
                    <div className="flex items-center text-amber-600">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>Em andamento</span>
                    </div>
                  )}
                  {order.status === "Concluído" && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>Concluído</span>
                    </div>
                  )}
                </div>
                <div className="font-semibold">
                  R$ {order.totalPrice.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 flex justify-between">
          <div className="text-sm text-gray-500">
            {order.technician ? `Técnico: ${order.technician}` : "Técnico não definido"}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-primary flex items-center"
            onClick={() => handleViewServiceOrder(order)}
          >
            Detalhes
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    ));
  }
};

export default ServiceOrders;
