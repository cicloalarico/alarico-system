
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { CalendarIcon, Trash, Plus } from "lucide-react";
import { Sale, Customer, Product } from "@/types";
import { paymentMethodOptions, saleStatusOptions } from "@/data/salesData";
import { customerOptions } from "@/data/serviceOrdersData";
import { productOptions } from "@/data/serviceOrdersData";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  id: z.string().optional(),
  customerId: z.number(),
  date: z.date(),
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number().min(1, "Quantidade deve ser maior que zero"),
      unitPrice: z.number().min(0.01, "Preço deve ser maior que zero"),
    })
  ).min(1, "Adicione pelo menos um produto"),
  paymentMethod: z.string(),
  status: z.string(),
  invoiceNumber: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SaleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: Sale;
}

const SaleForm: React.FC<SaleFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  // Convert the productOptions to fully conform to the Product type
  const [productData, setProductData] = useState<Product[]>(
    productOptions.map(product => ({
      id: product.id,
      code: product.code || `PROD-${product.id}`, // Provide default code if missing
      name: product.name,
      category: product.category || "",
      brand: product.brand || "",
      costPrice: product.costPrice || product.price || 0,
      sellPrice: product.price || 0,
      minSellPrice: product.minSellPrice || product.price || 0, // Add the missing property
      profitMargin: product.profitMargin || 0, // Add the missing property
      stock: product.stock || 0,
      minStock: product.minStock || 0,
      supplier: product.supplier || "",
      price: product.price,
      quantity: product.quantity
    }))
  );
  
  const [customers, setCustomers] = useState<Customer[]>(
    customerOptions.map((c) => ({ id: c.id, name: c.name, email: "", phone: "", cpf: "", address: "", notes: "" }))
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialData?.id || "",
      customerId: initialData?.customerId || 0,
      date: initialData ? new Date(initialData.date) : new Date(),
      items: initialData?.items.map((item) => ({
        productId: Number(item.productId),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })) || [],
      paymentMethod: initialData?.paymentMethod || "Dinheiro",
      status: initialData?.status || "Pendente",
      invoiceNumber: initialData?.invoiceNumber || "",
      notes: initialData?.notes || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Adicionar um produto vazio automaticamente se não houver produtos
  useEffect(() => {
    if (fields.length === 0) {
      append({ productId: 0, quantity: 1, unitPrice: 0 });
    }
  }, [fields.length, append]);

  // Atualizar o preço unitário quando o produto é selecionado
  const updateProductPrice = (index: number, productId: number) => {
    const product = productData.find((p) => p.id === productId);
    if (product) {
      form.setValue(`items.${index}.unitPrice`, product.sellPrice);
    }
  };

  const calculateTotal = () => {
    const items = form.getValues("items");
    return items.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
  };

  const onSubmit = (data: FormValues) => {
    const customerSelected = customers.find((c) => c.id === data.customerId);
    
    const formattedData: Sale = {
      id: data.id || `V${new Date().getFullYear()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      customerName: customerSelected?.name || "Cliente não identificado",
      customerId: data.customerId,
      date: format(data.date, "yyyy-MM-dd"),
      items: data.items.map((item, index) => {
        const product = productData.find((p) => p.id === item.productId);
        return {
          id: index.toString(),
          productId: item.productId,
          productName: product?.name || "Produto desconhecido",
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.quantity * item.unitPrice,
        };
      }),
      totalAmount: calculateTotal(),
      paymentMethod: data.paymentMethod as any,
      status: data.status as any,
      invoiceNumber: data.invoiceNumber,
      notes: data.notes,
    };

    onSave(formattedData);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Venda" : "Nova Venda"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cliente */}
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem
                            key={customer.id}
                            value={customer.id.toString()}
                          >
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <div>
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
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Lista de produtos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Produtos</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ productId: 0, quantity: 1, unitPrice: 0 })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Produto
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-2 items-start border rounded-md p-3"
                >
                  {/* Produto */}
                  <div className="col-span-5">
                    <FormField
                      control={form.control}
                      name={`items.${index}.productId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Produto</FormLabel>
                          <Select
                            value={field.value.toString()}
                            onValueChange={(value) => {
                              field.onChange(Number(value));
                              updateProductPrice(index, Number(value));
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o produto" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {productData.map((product) => (
                                <SelectItem
                                  key={product.id}
                                  value={product.id.toString()}
                                >
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Quantidade */}
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade</FormLabel>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Preço Unitário */}
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name={`items.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço Unitário</FormLabel>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Botão Remover */}
                  <div className="col-span-1 pt-8">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash size={18} />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Total calculado */}
              <div className="text-right font-medium">
                Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateTotal())}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Método de Pagamento */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pagamento</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Forma de pagamento" />
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

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Status da venda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {saleStatusOptions.map((option) => (
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

              {/* Número da Nota Fiscal */}
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número NF-e</FormLabel>
                    <Input placeholder="NF-e 000000" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Observações */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <Textarea
                    placeholder="Observações adicionais sobre a venda..."
                    className="min-h-[80px]"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SaleForm;
