import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Supplier } from "@/types";

interface SupplierFormProps {
  supplier: Partial<Supplier>;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ 
  supplier, 
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
          <Label htmlFor="name">Nome/Razão Social *</Label>
          <Input
            id="name"
            name="name"
            value={supplier.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ *</Label>
          <Input
            id="cnpj"
            name="cnpj"
            value={supplier.cnpj || ""}
            onChange={(e) => onChange("cnpj", e.target.value)}
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
            value={supplier.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            value={supplier.phone || ""}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          name="address"
          value={supplier.address || ""}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          name="notes"
          value={supplier.notes || ""}
          onChange={(e) => onChange("notes", e.target.value)}
          rows={3}
        />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          {supplier.id ? "Atualizar fornecedor" : "Adicionar fornecedor"}
        </Button>
      </div>
    </form>
  );
};

export default SupplierForm;
