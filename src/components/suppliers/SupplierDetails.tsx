import React from "react";
import { Supplier } from "@/types";

interface SupplierDetailsProps {
  supplier: Supplier;
}

const SupplierDetails: React.FC<SupplierDetailsProps> = ({ supplier }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Nome/Razão Social</p>
          <p>{supplier.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">CNPJ</p>
          <p>{supplier.cnpj}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">E-mail</p>
          <p>{supplier.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Telefone</p>
          <p>{supplier.phone || "-"}</p>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Endereço</p>
        <p>{supplier.address || "-"}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Observações</p>
        <p>{supplier.notes || "-"}</p>
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm font-medium text-gray-500 mb-2">Histórico</p>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">Nenhuma conta a pagar registrada.</p>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;
