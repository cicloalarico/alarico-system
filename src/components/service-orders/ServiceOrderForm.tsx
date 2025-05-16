
import React, { useState, useEffect } from "react";
import { format, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

// Interfaces for select options
export interface Customer {
  id: number;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface ServiceOption {
  id: string;
  name: string;
  price: number;
}

interface Technician {
  id: number;
  name: string;
}

interface PriorityOption {
  value: string;
  label: string;
}

// Payment method options
const paymentMethodOptions = [
  { value: "pix", label: "À vista: PIX" },
  { value: "dinheiro", label: "À vista: Dinheiro" },
  { value: "debito", label: "Débito" },
  { value: "credito", label: "Crédito" },
  { value: "crediario", label: "Crediário Loja" },
];

// Form schema
const serviceOrderSchema = z.object({
  customerId: z.number(),
  bikeModel: z.string().min(3, "Informe o modelo da bicicleta"),
  issueDescription: z.string().min(5, "Descreva o problema com mais detalhes"),
  scheduledFor: z.date(),
  priority: z.string(),
  technicianId: z.number().optional(),
  notes: z.string().optional(),
  laborValue: z.number().min(0, "Valor não pode ser negativo").optional(),
  paymentMethod: z.string().default("pix"),
  installments: z.number().min(1, "Mínimo de uma parcela").optional(),
  downPayment: z.number().min(0, "Valor não pode ser negativo").optional(),
  firstInstallmentDate: z.date().optional(),
});

type ServiceOrderFormValues = z.infer<typeof serviceOrderSchema>;

interface ServiceOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  customers: Customer[];
  productOptions: Product[];
  serviceOptions: ServiceOption[];
  technicianOptions: Technician[];
  priorityOptions: PriorityOption[];
}

const ServiceOrderForm = ({
  isOpen,
  onClose,
  onSubmit,
  customers,
  productOptions,
  serviceOptions,
  technicianOptions,
  priorityOptions,
}: ServiceOrderFormProps) => {
  const [selectedServices, setSelectedServices] = useState<Array<ServiceOption & { editedPrice?: number }>>([]);
  const [selectedProducts, setSelectedProducts] = useState<Array<{ product: Product, quantity: number, editedPrice?: number }>>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [showInstallments, setShowInstallments] = useState(false);
  const [installmentDates, setInstallmentDates] = useState<Array<{ date: Date; amount: number }>>([]);
  const [activeTab, setActiveTab] = useState("details");

  const form = useForm<ServiceOrderFormValues>({
    resolver: zodResolver(serviceOrderSchema),
    defaultValues: {
      bikeModel: "",
      issueDescription: "",
      scheduledFor: new Date(),
      priority: "Normal",
      notes: "",
      laborValue: 0,
      paymentMethod: "pix",
      installments: 1,
      downPayment: 0,
      firstInstallmentDate: new Date(),
    },
  });

  // Watch payment method to show/hide installments section
  const paymentMethod = form.watch("paymentMethod");
  const downPayment = form.watch("downPayment") || 0;
  const installments = form.watch("installments") || 1;
  const firstInstallmentDate = form.watch("firstInstallmentDate");

  // Watch for changes to update installment dates
  useEffect(() => {
    if (paymentMethod === "crediario" && firstInstallmentDate && installments > 0) {
      const dates = [];
      const amount = calculateInstallmentAmount();
      
      for (let i = 0; i < installments; i++) {
        dates.push({
          date: addMonths(firstInstallmentDate, i),
          amount: amount
        });
      }
      
      setInstallmentDates(dates);
    } else {
      setInstallmentDates([]);
    }
  }, [paymentMethod, installments, firstInstallmentDate, downPayment]);

  useEffect(() => {
    setShowInstallments(paymentMethod === "crediario");
  }, [paymentMethod]);

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setSelectedServices([]);
      setSelectedProducts([]);
      setSelectedServiceId(null);
      setSelectedProductId(null);
      setProductQuantity(1);
      setShowInstallments(false);
      setInstallmentDates([]);
      setActiveTab("details");
    }
  }, [isOpen, form]);

  const addService = () => {
    if (!selectedServiceId) return;
    
    const serviceToAdd = serviceOptions.find(s => s.id === selectedServiceId);
    if (!serviceToAdd) return;
    
    if (!selectedServices.some(s => s.id === serviceToAdd.id)) {
      setSelectedServices([...selectedServices, {
        ...serviceToAdd,
        editedPrice: serviceToAdd.price
      }]);
    }
    
    setSelectedServiceId(null);
  };

  const removeService = (id: string) => {
    setSelectedServices(selectedServices.filter(s => s.id !== id));
  };

  const updateServicePrice = (id: string, price: number) => {
    setSelectedServices(selectedServices.map(service => 
      service.id === id ? { ...service, editedPrice: price } : service
    ));
  };

  const addProduct = () => {
    if (!selectedProductId || productQuantity <= 0) return;
    
    const productToAdd = productOptions.find(p => p.id === selectedProductId);
    if (!productToAdd) return;
    
    const existingProduct = selectedProducts.findIndex(item => item.product.id === selectedProductId);
    
    if (existingProduct >= 0) {
      const updatedProducts = [...selectedProducts];
      updatedProducts[existingProduct].quantity += productQuantity;
      setSelectedProducts(updatedProducts);
    } else {
      setSelectedProducts([
        ...selectedProducts, 
        { 
          product: productToAdd, 
          quantity: productQuantity,
          editedPrice: productToAdd.price
        }
      ]);
    }
    
    setSelectedProductId(null);
    setProductQuantity(1);
  };

  const removeProduct = (id: string) => {
    setSelectedProducts(selectedProducts.filter(item => item.product.id !== id));
  };

  const updateProductPrice = (id: string, price: number) => {
    setSelectedProducts(selectedProducts.map(item => 
      item.product.id === id ? { ...item, editedPrice: price } : item
    ));
  };

  const calculateTotal = () => {
    const servicesTotal = selectedServices.reduce((sum, service) => sum + (service.editedPrice || service.price), 0);
    const productsTotal = selectedProducts.reduce(
      (sum, item) => sum + ((item.editedPrice || item.product.price) * item.quantity), 0
    );
    const laborValue = form.watch("laborValue") || 0;
    
    return servicesTotal + productsTotal + laborValue;
  };

  const calculateInstallmentAmount = () => {
    const total = calculateTotal();
    const downPaymentValue = downPayment || 0;
    const installmentCount = installments || 1;
    
    if (installmentCount <= 0) return 0;
    return (total - downPaymentValue) / installmentCount;
  };

  const handleSubmit = (data: ServiceOrderFormValues) => {
    const formattedServices = selectedServices.map(service => ({
      id: service.id,
      name: service.name,
      price: service.editedPrice || service.price,
    }));
    
    const formattedProducts = selectedProducts.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.editedPrice || item.product.price,
      quantity: item.quantity,
      subtotal: (item.editedPrice || item.product.price) * item.quantity,
    }));
    
    const totalPrice = calculateTotal();
    const installmentAmount = calculateInstallmentAmount();
    
    const formData = {
      ...data,
      services: formattedServices,
      products: formattedProducts,
      totalPrice,
      customer: customers.find(c => c.id === data.customerId),
      technician: data.technicianId 
        ? technicianOptions.find(t => t.id === data.technicianId)?.name 
        : null,
      installmentAmount: showInstallments ? installmentAmount : undefined,
      installmentDates: showInstallments ? installmentDates : undefined,
    };
    
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Nova Ordem de Serviço</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="items">Itens e Pagamento</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value ? field.value.toString() : undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id.toString()}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bikeModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo da Bicicleta</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Caloi 10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="issueDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição do Problema</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva o problema relatado pelo cliente"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="scheduledFor"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data Agendada</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy", {
                                    locale: ptBR,
                                  })
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prioridade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a prioridade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {priorityOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="technicianId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Técnico Responsável</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value ? field.value.toString() : undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um técnico" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Não atribuído</SelectItem>
                          {technicianOptions.map((technician) => (
                            <SelectItem key={technician.id} value={technician.id.toString()}>
                              {technician.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Observações adicionais sobre o serviço"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end pt-4">
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab("items")}
                    className="w-full sm:w-auto"
                  >
                    Continuar
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="items" className="space-y-4 pt-4">
                {/* Services selection */}
                <div className="space-y-2">
                  <div className="font-medium">Serviços</div>
                  
                  <div className="flex gap-2">
                    <Select value={selectedServiceId || ""} onValueChange={setSelectedServiceId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceOptions.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={addService} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {selectedServices.length > 0 ? (
                    <div className="border rounded-md">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Serviço
                            </th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Valor
                            </th>
                            <th className="px-3 py-2 w-12"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedServices.map((service) => (
                            <tr key={service.id}>
                              <td className="px-3 py-2">{service.name}</td>
                              <td className="px-3 py-2 text-right">
                                <Input 
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="w-28 ml-auto text-right"
                                  value={service.editedPrice || service.price}
                                  onChange={(e) => updateServicePrice(service.id, parseFloat(e.target.value) || service.price)}
                                />
                              </td>
                              <td className="px-3 py-2">
                                <Button 
                                  type="button" 
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeService(service.id)}
                                >
                                  <Trash className="h-4 w-4 text-red-500" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      Nenhum serviço adicionado
                    </div>
                  )}
                </div>
                
                {/* Products selection */}
                <div className="space-y-2">
                  <div className="font-medium">Peças</div>
                  
                  <div className="flex gap-2">
                    <Select value={selectedProductId || ""} onValueChange={setSelectedProductId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma peça" />
                      </SelectTrigger>
                      <SelectContent>
                        {productOptions.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input 
                      type="number" 
                      min="1"
                      className="w-20" 
                      value={productQuantity}
                      onChange={(e) => setProductQuantity(parseInt(e.target.value) || 1)}
                    />
                    <Button type="button" onClick={addProduct} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {selectedProducts.length > 0 ? (
                    <div className="border rounded-md">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Peça
                            </th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Qtd
                            </th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Valor Unit.
                            </th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Subtotal
                            </th>
                            <th className="px-3 py-2 w-12"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedProducts.map((item) => (
                            <tr key={item.product.id}>
                              <td className="px-3 py-2">{item.product.name}</td>
                              <td className="px-3 py-2 text-right">{item.quantity}</td>
                              <td className="px-3 py-2 text-right">
                                <Input 
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="w-28 ml-auto text-right"
                                  value={item.editedPrice || item.product.price}
                                  onChange={(e) => updateProductPrice(item.product.id, parseFloat(e.target.value) || item.product.price)}
                                />
                              </td>
                              <td className="px-3 py-2 text-right">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format((item.editedPrice || item.product.price) * item.quantity)}
                              </td>
                              <td className="px-3 py-2">
                                <Button 
                                  type="button" 
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeProduct(item.product.id)}
                                >
                                  <Trash className="h-4 w-4 text-red-500" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      Nenhuma peça adicionada
                    </div>
                  )}
                </div>
                
                <FormField
                  control={form.control}
                  name="laborValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da Mão de Obra</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="0"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="py-2 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-medium">Total:</div>
                    <div className="font-bold text-lg">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(calculateTotal())}
                    </div>
                  </div>
                  
                  {/* Payment method */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Forma de Pagamento</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a forma de pagamento" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {paymentMethodOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {showInstallments && (
                      <div className="space-y-4 border-t border-gray-200 pt-4">
                        <FormField
                          control={form.control}
                          name="downPayment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor de Entrada</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="installments"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantidade de Parcelas</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number"
                                  min="1"
                                  max="12"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="firstInstallmentDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data da Primeira Parcela</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "dd/MM/yyyy", {
                                          locale: ptBR,
                                        })
                                      ) : (
                                        <span>Selecione uma data</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="py-2 flex justify-between items-center">
                          <div>Valor da Parcela:</div>
                          <div className="font-medium">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(calculateInstallmentAmount())} x {installments}
                          </div>
                        </div>
                        
                        {installmentDates.length > 0 && (
                          <div className="mt-4">
                            <div className="font-medium mb-2">Datas das Parcelas:</div>
                            <div className="border rounded-md">
                              <table className="w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Parcela
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Data de Vencimento
                                    </th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Valor
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {installmentDates.map((item, index) => (
                                    <tr key={index}>
                                      <td className="px-4 py-2">{index + 1}/{installments}</td>
                                      <td className="px-4 py-2">
                                        {format(item.date, "dd/MM/yyyy", { locale: ptBR })}
                                      </td>
                                      <td className="px-4 py-2 text-right">
                                        {new Intl.NumberFormat('pt-BR', {
                                          style: 'currency',
                                          currency: 'BRL'
                                        }).format(item.amount)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("details")}
                  >
                    Voltar
                  </Button>
                  <Button type="submit">Salvar</Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceOrderForm;
