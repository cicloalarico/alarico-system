
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { StockMovement } from "@/types";

interface StockMovementsListProps {
  movements: StockMovement[];
  productIdToName?: Record<number, string>;
}

const StockMovementsList: React.FC<StockMovementsListProps> = ({ 
  movements,
  productIdToName = {}
}) => {
  if (movements.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma movimentação registrada.
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            {Object.keys(productIdToName).length > 0 && <TableHead>Produto</TableHead>}
            <TableHead>Tipo</TableHead>
            <TableHead className="text-center">Qtd</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead className="hidden md:table-cell">Doc.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell>
                <div>{movement.date.split('-').reverse().join('/')}</div>
                <div className="text-xs text-gray-500">{movement.time}</div>
              </TableCell>
              {Object.keys(productIdToName).length > 0 && (
                <TableCell>{productIdToName[movement.productId] || `Produto #${movement.productId}`}</TableCell>
              )}
              <TableCell>
                {movement.type === "entrada" ? (
                  <div className="flex items-center text-green-600">
                    <ArrowDownCircle className="mr-1 h-4 w-4" />
                    <span>Entrada</span>
                  </div>
                ) : (
                  <div className="flex items-center text-amber-600">
                    <ArrowUpCircle className="mr-1 h-4 w-4" />
                    <span>Saída</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-center font-medium">{movement.quantity}</TableCell>
              <TableCell>{movement.reason}</TableCell>
              <TableCell className="hidden md:table-cell">{movement.document}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockMovementsList;
