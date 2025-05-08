
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bill } from "@/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBillStatusBadgeVariant } from "@/data/billsData";

interface BillsListProps {
  bills: Bill[];
  onViewBill: (id: string) => void;
  onEditBill: (id: string) => void;
  onDeleteBill: (id: string) => void;
  onDuplicateBill: (id: string) => void;
  onPayBill: (id: string) => void;
}

const BillsList: React.FC<BillsListProps> = ({
  bills,
  onViewBill,
  onEditBill,
  onDeleteBill,
  onDuplicateBill,
  onPayBill
}) => {
  // Formatador de números para moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Formatador de datas para o formato brasileiro
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Frequência</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                Nenhuma conta a pagar encontrada.
              </TableCell>
            </TableRow>
          ) : (
            bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell className="font-medium">{bill.description}</TableCell>
                <TableCell className="capitalize">{bill.category}</TableCell>
                <TableCell>{formatDate(bill.dueDate)}</TableCell>
                <TableCell className="text-right">{formatCurrency(bill.amount)}</TableCell>
                <TableCell>
                  <Badge variant={getBillStatusBadgeVariant(bill.status)}>
                    {bill.status === "pago" ? "Pago" : 
                     bill.status === "pendente" ? "Pendente" :
                     bill.status === "atrasado" ? "Atrasado" : "Cancelado"}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">{bill.frequency}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {bill.status !== "pago" && (
                      <Button variant="outline" size="sm" onClick={() => onPayBill(bill.id)}>
                        Pagar
                      </Button>
                    )}
                    <Button variant="outline" size="icon" onClick={() => onViewBill(bill.id)}>
                      <span className="sr-only">Ver detalhes</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => onEditBill(bill.id)}>
                      <span className="sr-only">Editar</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => onDuplicateBill(bill.id)}>
                      <span className="sr-only">Duplicar</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => onDeleteBill(bill.id)}>
                      <span className="sr-only">Excluir</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BillsList;
