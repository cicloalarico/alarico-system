
import React from "react";
import { Customer } from "@/types";

interface CustomerDetailsProps {
  customer: Customer;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Nome</p>
          <p>{customer.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">CPF/CNPJ</p>
          <p>{customer.cpf}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">E-mail</p>
          <p>{customer.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Telefone</p>
          <p>{customer.phone}</p>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Endereço</p>
        <p>{customer.address}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Observações</p>
        <p className={customer.notes.toLowerCase().includes("inadimplente") 
          ? "text-red-500" 
          : customer.notes.toLowerCase().includes("vip") 
            ? "text-green-600" 
            : ""}>
          {customer.notes || "-"}
        </p>
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm font-medium text-gray-500 mb-2">Histórico</p>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">Nenhuma ordem de serviço ou compra registrada.</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
