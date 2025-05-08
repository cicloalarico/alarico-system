
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

// Tipos de serviço para ordem de serviço
export interface Service {
  id: number;
  name: string;
  price: number;
}

// Produto para ordem de serviço
export interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  stock?: number;
}

interface ServiceOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  customers: Array<{ id: number, name: string }>;
  serviceOptions: Service[];
  productOptions: Product[];
  technicianOptions: Array<{ id: number, name: string }>;
  priorityOptions: Array<{ value: string, label: string }>;
}

const ServiceOrderForm: React.FC<ServiceOrderFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  customers,
  serviceOptions,
  productOptions,
  technicianOptions,
  priorityOptions,
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState({
    customer: "",
    bikeModel: "",
    issueDescription: "",
    priority: "Normal",
    technicianId: "",
    scheduledFor: new Date().toISOString().split("T")[0],
    notes: "",
    services: [] as Array<Service & { id: number }>,
    products: [] as Array<Product & { id: number, subtotal: number }>,
  });
  
  // Estado para campos temporários
  const [selectedService, setSelectedService] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productQuantity, setProductQuantity] = useState(1);

  // Handlers para campos de formulário
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Adicionar serviço
  const handleAddService = () => {
    if (!selectedService) return;
    
    const service = serviceOptions.find(s => s.name === selectedService);
    if (service) {
      const newServices = [...formData.services, { ...service }];
      setFormData({
        ...formData,
        services: newServices,
      });
      setSelectedService("");
    }
  };

  // Adicionar produto
  const handleAddProduct = () => {
    if (!selectedProduct || productQuantity <= 0) return;
    
    const product = productOptions.find(p => p.name === selectedProduct);
    if (product) {
      const newProducts = [...formData.products, { 
        ...product, 
        quantity: productQuantity,
        subtotal: product.price * productQuantity
      }];
      setFormData({
        ...formData,
        products: newProducts,
      });
      setSelectedProduct("");
      setProductQuantity(1);
    }
  };

  // Remover serviço
  const handleRemoveService = (id: number) => {
    setFormData({
      ...formData,
      services: formData.services.filter(s => s.id !== id),
    });
  };

  // Remover produto
  const handleRemoveProduct = (id: number) => {
    setFormData({
      ...formData,
      products: formData.products.filter(p => p.id !== id),
    });
  };

  // Calcular total
  const calculateTotal = () => {
    let servicesTotal = formData.services.reduce(
      (sum, service) => sum + service.price,
      0
    );
    let productsTotal = formData.products.reduce(
      (sum, product) => sum + product.subtotal,
      0
    );
    return servicesTotal + productsTotal;
  };
  
  // Enviar formulário
  const handleSubmit = () => {
    if (!formData.customer || !formData.bikeModel || !formData.issueDescription) {
      return;
    }

    onSubmit({
      ...formData,
      totalPrice: calculateTotal()
    });
    
    // Reset form
    setFormData({
      customer: "",
      bikeModel: "",
      issueDescription: "",
      priority: "Normal",
      technicianId: "",
      scheduledFor: new Date().toISOString().split("T")[0],
      notes: "",
      services: [],
      products: [],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Ordem de Serviço</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Cliente *</Label>
              <Select 
                value={formData.customer} 
                onValueChange={(value) => handleChange("customer", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
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
                value={formData.priority} 
                onValueChange={(value) => handleChange("priority", value)}
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
                value={formData.bikeModel}
                onChange={(e) => handleChange("bikeModel", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledFor">Data Agendada</Label>
              <Input
                id="scheduledFor"
                type="date"
                value={formData.scheduledFor}
                onChange={(e) => handleChange("scheduledFor", e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="technicianId">Técnico Responsável</Label>
            <Select 
              value={formData.technicianId} 
              onValueChange={(value) => handleChange("technicianId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um técnico" />
              </SelectTrigger>
              <SelectContent>
                {technicianOptions.map((technician) => (
                  <SelectItem key={technician.id} value={technician.id.toString()}>
                    {technician.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueDescription">Descrição do Problema *</Label>
            <Textarea
              id="issueDescription"
              value={formData.issueDescription}
              onChange={(e) => handleChange("issueDescription", e.target.value)}
              rows={3}
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Serviços</h3>

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

            {formData.services.length > 0 ? (
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
                    {formData.services.map((service) => (
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
            <h3 className="font-medium mb-4">Peças e Produtos</h3>

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
                        {product.name} - R$ {product.price.toFixed(2)} {product.stock && `(Estoque: ${product.stock})`}
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

            {formData.products.length > 0 ? (
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
                    {formData.products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="text-center">
                          {product.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          R$ {product.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          R$ {product.subtotal.toFixed(2)}
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
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={2}
            />
          </div>

          <div className="mt-4 bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span>R$ {calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Criar Ordem de Serviço
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceOrderForm;
