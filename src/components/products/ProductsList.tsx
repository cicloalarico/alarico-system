
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Edit, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/types";

interface ProductsListProps {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ 
  products, 
  onView, 
  onEdit 
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-100">
        <div className="text-gray-500">Nenhum produto encontrado</div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead className="hidden md:table-cell">Categoria</TableHead>
            <TableHead className="hidden md:table-cell">Marca</TableHead>
            <TableHead className="text-right">Preço (R$)</TableHead>
            <TableHead className="text-center">Estoque</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.code}</TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="hidden md:table-cell">{product.category}</TableCell>
              <TableCell className="hidden md:table-cell">{product.brand}</TableCell>
              <TableCell className="text-right">
                {product.sellPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <span className={`font-medium ${
                    product.stock < product.minStock ? "text-red-500" : "text-green-600"
                  }`}>
                    {product.stock}
                  </span>
                  {product.stock < product.minStock && (
                    <AlertTriangle size={16} className="ml-2 text-red-500" />
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Ações</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(product)}>
                      Detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(product)}>
                      <Edit className="mr-2 h-4 w-4" /> Editar
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

export default ProductsList;
