
import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { FinancialTransaction } from "@/types/financial";
import { PaymentMethodType, TransactionStatusType } from "@/types/common";
import { categories } from "@/data/financialData";
import { paymentMethodOptions } from "@/data/salesData";
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
  description: z.string().min(3, "Descrição é obrigatória"),
  category: z.string(),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  type: z.enum(["receita", "despesa"]),
  date: z.date(),
  dueDate: z.date().optional().nullable(),
  paymentMethod: z.string(),
  status: z.enum(["pago", "pendente", "cancelado"]),
  relatedId: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FinancialTransaction) => void;
  initialData?: FinancialTransaction;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [transactionType, setTransactionType] = useState<"receita" | "despesa">(
    initialData?.type || "receita"
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialData?.id || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      amount: initialData?.amount || 0,
      type: initialData?.type || "receita",
      date: initialData ? new Date(initialData.date) : new Date(),
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : null,
      paymentMethod: initialData?.paymentMethod || "Dinheiro",
      status: initialData?.status || "pago",
      relatedId: initialData?.relatedId || "",
      notes: initialData?.notes || "",
    },
  });

  const onSubmit = (data: FormValues) => {
    const formattedData: FinancialTransaction = {
      id:
        data.id ||
        `F${new Date().getFullYear()}${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
      date: format(data.date, "yyyy-MM-dd"),
      description: data.description,
      category: data.category,
      amount: data.amount,
      type: data.type,
      paymentMethod: data.paymentMethod as PaymentMethodType,
      status: data.status as TransactionStatusType, // Garantindo que o tipo está correto
      dueDate: data.dueDate ? format(data.dueDate, "yyyy-MM-dd") : undefined,
      relatedId: data.relatedId || undefined,
      notes: data.notes || "",
    };

    onSave(formattedData);
    form.reset();
  };

  // Atualiza o tipo de transação no estado local e no formulário
  const handleTypeChange = (type: "receita" | "despesa") => {
    setTransactionType(type);
    form.setValue("type", type);
    form.setValue("category", ""); // Reset category when changing type
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? "Editar Transação"
              : "Nova Transação Financeira"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tipo de Transação */}
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant={transactionType === "receita" ? "default" : "outline"}
                onClick={() => handleTypeChange("receita")}
                className="flex-1"
              >
                Receita
              </Button>
              <Button
                type="button"
                variant={transactionType === "despesa" ? "default" : "outline"}
                onClick={() => handleTypeChange("despesa")}
                className="flex-1"
              >
                Despesa
              </Button>
            </div>

            {/* Descrição */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <Input placeholder="Descrição da transação" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
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

              {/* Valor */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Categoria */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {transactionType === "receita"
                        ? categories.receita.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))
                        : categories.despesa.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
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
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pago">Pago</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Data de Vencimento (apenas para despesas pendentes) */}
            {transactionType === "despesa" && form.watch("status") === "pendente" && (
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Vencimento</FormLabel>
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
                            selected={field.value || undefined}
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
            )}

            {/* ID Relacionado (opcional) */}
            <FormField
              control={form.control}
              name="relatedId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Relacionado (opcional)</FormLabel>
                  <Input
                    placeholder="Número de venda ou ordem de serviço"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Observações */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <Textarea
                    placeholder="Observações adicionais..."
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

export default TransactionForm;
