
import React, { useState, useEffect } from 'react';
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Bill, BillCategoryType, BillFrequencyType, BillStatusType } from '@/types';

interface BillFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bill: Bill) => void;
  initialData?: Bill | null;
  suppliers?: Array<{ id: number, name: string }>;
  employees?: Array<{ id: number, name: string }>;
}

const billCategories: { value: BillCategoryType, label: string }[] = [
  { value: "fornecedor", label: "Fornecedor" },
  { value: "utilidades", label: "Utilidades" },
  { value: "funcionário", label: "Funcionário" },
  { value: "aluguel", label: "Aluguel" },
  { value: "impostos", label: "Impostos" },
  { value: "marketing", label: "Marketing" },
  { value: "outros", label: "Outros" },
];

const billFrequencies: { value: BillFrequencyType, label: string }[] = [
  { value: "único", label: "Único" },
  { value: "mensal", label: "Mensal" },
  { value: "trimestral", label: "Trimestral" },
  { value: "semestral", label: "Semestral" },
  { value: "anual", label: "Anual" },
];

const BillForm: React.FC<BillFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  suppliers = [],
  employees = [],
}) => {
  const [formData, setFormData] = useState<Partial<Bill>>({
    description: "",
    category: "outros",
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    status: "pendente",
    frequency: "único",
    isRecurring: false,
    supplier: "",
    notes: "",
  });

  const [isAdvance, setIsAdvance] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        dueDate: initialData.dueDate ? initialData.dueDate : new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleEmployeeAdvanceChange = (employeeName: string) => {
    setSelectedEmployee(employeeName);
    handleChange("description", `Adiantamento para ${employeeName}`);
    handleChange("category", "funcionário");
  };

  const handleSubmit = () => {
    if (!formData.description || !formData.amount || !formData.dueDate) {
      return;
    }

    onSubmit({
      id: initialData?.id || `BILL-${Date.now()}`,
      description: formData.description || "",
      category: formData.category as BillCategoryType || "outros",
      amount: formData.amount || 0,
      dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
      status: formData.status as BillStatusType || "pendente",
      frequency: formData.frequency as BillFrequencyType || "único",
      supplier: formData.supplier,
      notes: formData.notes,
      document: formData.document,
      isRecurring: formData.isRecurring || false,
      paymentDate: formData.paymentDate,
      parentBillId: formData.parentBillId,
    });
    
    // Reset form after submission
    setFormData({
      description: "",
      category: "outros",
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      status: "pendente",
      frequency: "único",
      isRecurring: false,
      supplier: "",
      notes: "",
    });
    setIsAdvance(false);
    setSelectedEmployee("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Conta a Pagar" : "Nova Conta a Pagar"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!initialData && (
            <div className="space-y-2">
              <Label>Tipo de Conta</Label>
              <RadioGroup 
                defaultValue="regular" 
                className="flex gap-4" 
                value={isAdvance ? "advance" : "regular"}
                onValueChange={(value) => setIsAdvance(value === "advance")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="regular" id="regular" />
                  <Label htmlFor="regular">Conta Regular</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advance" id="advance" />
                  <Label htmlFor="advance">Adiantamento Funcionário</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {isAdvance ? (
            <div className="space-y-2">
              <Label htmlFor="employee">Funcionário</Label>
              <Select 
                value={selectedEmployee}
                onValueChange={handleEmployeeAdvanceChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um funcionário" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.name}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Input
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount || ""}
                onChange={(e) => handleChange("amount", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Data de Vencimento *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate || ""}
                onChange={(e) => handleChange("dueDate", e.target.value)}
              />
            </div>
          </div>

          {!isAdvance && (
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {billCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.category === "fornecedor" && (
            <div className="space-y-2">
              <Label htmlFor="supplier">Fornecedor</Label>
              <Select 
                value={formData.supplier} 
                onValueChange={(value) => handleChange("supplier", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.name}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="atrasado">Atrasado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.status === "pago" && (
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Data de Pagamento</Label>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate || ""}
                onChange={(e) => handleChange("paymentDate", e.target.value)}
              />
            </div>
          )}

          {!isAdvance && (
            <>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) => 
                      handleChange("isRecurring", checked === true)
                    }
                  />
                  <Label htmlFor="isRecurring">É recorrente</Label>
                </div>
              </div>

              {formData.isRecurring && (
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequência</Label>
                  <Select 
                    value={formData.frequency} 
                    onValueChange={(value) => handleChange("frequency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      {billFrequencies.map((frequency) => (
                        <SelectItem key={frequency.value} value={frequency.value}>
                          {frequency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? "Atualizar" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BillForm;
