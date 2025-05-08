
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EmployeeSalary, EmployeeAdvance, BillStatusType } from "@/types";

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
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";

// Esquema de validação para o formulário
const formSchema = z.object({
  employeeName: z.string().min(3, { message: "Nome do funcionário é obrigatório" }),
  description: z.string().min(3, { message: "Descrição é obrigatória" }),
  baseSalary: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a zero" }),
  commission: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a zero" }),
  salesTarget: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a zero" }),
  dueDate: z.date({ required_error: "Data de vencimento é obrigatória" }),
  paymentDate: z.date().optional(),
  status: z.enum(["pendente", "pago", "atrasado", "cancelado"] as const),
  notes: z.string().optional(),
});

interface EmployeeSalaryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (salary: EmployeeSalary) => void;
  initialData?: EmployeeSalary;
}

const EmployeeSalaryForm: React.FC<EmployeeSalaryFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const isEditMode = !!initialData;
  const [advances, setAdvances] = useState<EmployeeAdvance[]>(
    initialData?.advances || []
  );

  // Inicializa o formulário com o react-hook-form e validação zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeName: initialData?.employeeName || "",
      description: initialData?.description || "",
      baseSalary: initialData?.baseSalary || 0,
      commission: initialData?.commission || 0,
      salesTarget: initialData?.salesTarget || 0,
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : new Date(),
      paymentDate: initialData?.paymentDate ? new Date(initialData.paymentDate) : undefined,
      status: initialData?.status || "pendente",
      notes: initialData?.notes || "",
    },
  });

  // Cálculos totais
  const calculateTotals = () => {
    const baseSalary = form.watch("baseSalary") || 0;
    const commission = form.watch("commission") || 0;
    const totalAdvancesAmount = advances.reduce((total, adv) => total + adv.amount, 0);
    const grossSalary = baseSalary + commission;
    const netSalary = grossSalary - totalAdvancesAmount;
    
    return { totalAdvancesAmount, grossSalary, netSalary };
  };
  
  const { totalAdvancesAmount, grossSalary, netSalary } = calculateTotals();

  // Formatação de datas
  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  // Manipula a adição de um novo adiantamento
  const handleAddAdvance = () => {
    const newAdvance: EmployeeAdvance = {
      id: `ADV${new Date().getFullYear()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      description: "",
    };
    setAdvances([...advances, newAdvance]);
  };

  // Manipula a atualização de um adiantamento
  const handleUpdateAdvance = (index: number, field: keyof EmployeeAdvance, value: any) => {
    const updatedAdvances = [...advances];
    updatedAdvances[index] = { ...updatedAdvances[index], [field]: value };
    setAdvances(updatedAdvances);
  };

  // Manipula a remoção de um adiantamento
  const handleRemoveAdvance = (index: number) => {
    const updatedAdvances = advances.filter((_, i) => i !== index);
    setAdvances(updatedAdvances);
  };

  // Formatador de números para moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Manipula o envio do formulário
  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // Calcular os totais
    const { totalAdvancesAmount, grossSalary, netSalary } = calculateTotals();
    
    const newEmployeeSalary: EmployeeSalary = {
      id: initialData?.id || `SAL${new Date().getFullYear()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      employeeId: initialData?.employeeId || `E${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      employeeName: data.employeeName,
      description: data.description,
      category: "funcionário",
      baseSalary: data.baseSalary,
      commission: data.commission,
      salesTarget: data.salesTarget,
      advances: advances,
      totalAdvances: totalAdvancesAmount,
      netSalary: netSalary,
      amount: grossSalary,
      dueDate: data.dueDate.toISOString().split('T')[0],
      paymentDate: data.paymentDate ? data.paymentDate.toISOString().split('T')[0] : undefined,
      status: data.status as BillStatusType,
      frequency: "mensal",
      notes: data.notes,
      isRecurring: true,
    };
    
    onSave(newEmployeeSalary);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Salário de Funcionário" : "Novo Registro de Salário"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome do Funcionário */}
              <FormField
                control={form.control}
                name="employeeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Funcionário</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Descrição */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Salário Base */}
              <FormField
                control={form.control}
                name="baseSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salário Base (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Comissão */}
              <FormField
                control={form.control}
                name="commission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comissão (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Meta de Vendas */}
              <FormField
                control={form.control}
                name="salesTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta de Vendas (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />
            
            {/* Adiantamentos */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Adiantamentos/Vales</h3>
                <Button 
                  type="button" 
                  onClick={handleAddAdvance} 
                  variant="outline" 
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </Button>
              </div>
              
              {advances.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum adiantamento registrado.</p>
              ) : (
                <div className="space-y-4">
                  {advances.map((advance, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      {/* Data */}
                      <div className="flex-1">
                        <label className="text-sm font-medium">Data</label>
                        <Input
                          type="date"
                          value={advance.date}
                          onChange={(e) => handleUpdateAdvance(index, "date", e.target.value)}
                        />
                      </div>
                      
                      {/* Valor */}
                      <div className="flex-1">
                        <label className="text-sm font-medium">Valor (R$)</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={advance.amount}
                          onChange={(e) => handleUpdateAdvance(index, "amount", parseFloat(e.target.value))}
                        />
                      </div>
                      
                      {/* Descrição */}
                      <div className="flex-1">
                        <label className="text-sm font-medium">Descrição</label>
                        <Input
                          value={advance.description}
                          onChange={(e) => handleUpdateAdvance(index, "description", e.target.value)}
                        />
                      </div>
                      
                      {/* Botão Remover */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAdvance(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Separator />
            
            {/* Resumo Financeiro */}
            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Resumo Financeiro</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Salário Base:</span>
                  <span className="float-right">{formatCurrency(form.watch("baseSalary") || 0)}</span>
                </div>
                <div>
                  <span className="font-medium">Comissão:</span>
                  <span className="float-right">{formatCurrency(form.watch("commission") || 0)}</span>
                </div>
                <div>
                  <span className="font-medium">Total Adiantamentos:</span>
                  <span className="float-right text-red-500">{formatCurrency(totalAdvancesAmount)}</span>
                </div>
                <div>
                  <span className="font-medium">Meta de Vendas:</span>
                  <span className="float-right">{formatCurrency(form.watch("salesTarget") || 0)}</span>
                </div>
                
                <Separator className="col-span-2 my-2" />
                
                <div>
                  <span className="font-medium">Salário Bruto:</span>
                  <span className="float-right font-medium">{formatCurrency(grossSalary)}</span>
                </div>
                <div>
                  <span className="font-medium">Salário Líquido:</span>
                  <span className="float-right font-medium">{formatCurrency(netSalary)}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data de Vencimento */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Pagamento</FormLabel>
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
                              formatDate(field.value)
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="pago">Pago</SelectItem>
                        <SelectItem value="atrasado">Atrasado</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {form.watch("status") === "pago" && (
              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Pagamento Efetuado</FormLabel>
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
                              formatDate(field.value)
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {/* Observações */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      value={field.value || ""} 
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit">
                {isEditMode ? "Atualizar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeSalaryForm;
