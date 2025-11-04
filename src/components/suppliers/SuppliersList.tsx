import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Supplier } from "@/types";

interface SuppliersListProps {
  suppliers: Supplier[];
  onView: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: number) => void;
}

const SuppliersList: React.FC<SuppliersListProps> = ({ 
  suppliers, 
  onView,
  onEdit, 
  onDelete
}) => {
  if (suppliers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum fornecedor cadastrado.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell className="font-medium">{supplier.name}</TableCell>
              <TableCell>{supplier.cnpj}</TableCell>
              <TableCell>{supplier.email}</TableCell>
              <TableCell>{supplier.phone || "-"}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(supplier)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(supplier)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(supplier.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SuppliersList;
