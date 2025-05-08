
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FilePrinter } from "lucide-react";
import { Sale } from "@/types";
import { Badge } from "@/components/ui/badge";

interface SaleDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  sale?: Sale;
}

const SaleDetails: React.FC<SaleDetailsProps> = ({ isOpen, onClose, sale }) => {
  if (!sale) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Detalhes da Venda</DialogTitle>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <FilePrinter className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Cabeçalho da venda */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Informações da Venda</h3>
              <div className="flex justify-between">
                <span className="text-gray-500">Nº da Venda:</span>
                <span className="font-medium">{sale.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Data:</span>
                <span>
                  {format(new Date(sale.date), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <Badge
                  variant={
                    sale.status === "Concluída"
                      ? "default"
                      : sale.status === "Pendente"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {sale.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">NF-e:</span>
                <span>{sale.invoiceNumber || "Não emitida"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-lg">Informações do Cliente</h3>
              <div className="flex justify-between">
                <span className="text-gray-500">Cliente:</span>
                <span>{sale.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pagamento:</span>
                <span>{sale.paymentMethod}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Lista de produtos */}
          <div className="space-y-2">
            <h3 className="font-medium text-lg">Produtos</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Produto
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Preço Unit.
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantidade
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sale.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span>{item.productName}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {formatCurrency(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 text-right text-sm font-medium"
                    >
                      Total:
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold">
                      {formatCurrency(sale.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Observações */}
          {sale.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Observações</h3>
                <p className="text-gray-700">{sale.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaleDetails;
