
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Customer } from "@/types";

interface CustomerFormProps {
  customer: Partial<Customer>;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ 
  customer, 
  onChange, 
  onSubmit 
}) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo *</Label>
          <Input
            id="name"
            name="name"
            value={customer.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF/CNPJ *</Label>
          <Input
            id="cpf"
            name="cpf"
            value={customer.cpf || ""}
            onChange={(e) => onChange("cpf", e.target.value)}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={customer.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            value={customer.phone || ""}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          name="address"
          value={customer.address || ""}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          name="notes"
          value={customer.notes || ""}
          onChange={(e) => onChange("notes", e.target.value)}
          placeholder="Informações adicionais sobre o cliente..."
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          {customer.id ? "Atualizar cliente" : "Adicionar cliente"}
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;
