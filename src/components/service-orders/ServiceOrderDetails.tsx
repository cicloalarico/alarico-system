import React, { useState } from "react";
import { format, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceOrder, ServiceStatusType } from "@/types/serviceOrders";
import ServiceStatus from "./ServiceStatus";

interface ServiceOrderDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  order: ServiceOrder | null;
  onUpdateStatus: (id: string, status: ServiceStatusType) => void;
}

const ServiceOrderDetails = ({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
}: ServiceOrderDetailsProps) => {
  const [activeTab, setActiveTab] = useState("details");
  
  if (!order) return null;

  const handleStatusChange = (value: string) => {
    onUpdateStatus(order.id, value as ServiceStatusType);
  };

  // Handle display of customer name based on type
  const getCustomerName = () => {
    if (typeof order.customer === 'string') {
      return order.customer;
    } else if (order.customer && typeof order.customer === 'object') {
      return order.customer.name;
    }
    return "Cliente não especificado";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  
  // Generate installment dates if using store credit
  const renderInstallmentDates = () => {
    if (order.paymentMethod !== "Crediário Loja" || !order.installments || !order.firstInstallmentDate) {
      return null;
    }
    
    const installmentDates = [];
    const firstDate = new Date(order.firstInstallmentDate);
    
    for (let i = 0; i < order.installments; i++) {
      const date = addMonths(firstDate, i);
      installmentDates.push({
        installment: i + 1,
        date,
        amount: order.installmentAmount || 0
      });
    }
    
    return (
      <div className="mt-4 border rounded-md">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parcela
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Vencimento
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {installmentDates.map((item) => (
              <tr key={item.installment}>
                <td className="px-4 py-2">{item.installment}/{order.installments}</td>
                <td className="px-4 py-2">
                  {format(item.date, "dd/MM/yyyy", { locale: ptBR })}
                </td>
                <td className="px-4 py-2 text-right">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Ordem de Serviço</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="payment">Pagamento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold text-lg">Cliente</div>
                <div>{getCustomerName()}</div>
                
                <div className="mt-4 font-semibold">Bicicleta</div>
                <div>{order.bikeModel}</div>

                <div className="mt-4 font-semibold">Problema Relatado</div>
                <div>{order.issueDescription}</div>

                <div className="mt-4 font-semibold">Notas Adicionais</div>
                <div>{order.notes || "Nenhuma nota adicional"}</div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <div className="font-semibold">Status</div>
                  <ServiceStatus status={order.status} />
                </div>

                <div className="mt-4">
                  <Label htmlFor="status">Alterar Status</Label>
                  <Select
                    defaultValue={order.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aberta">Aberta</SelectItem>
                      <SelectItem value="Em andamento">Em andamento</SelectItem>
                      <SelectItem value="Aguardando peças">
                        Aguardando peças
                      </SelectItem>
                      <SelectItem value="Concluída">Concluída</SelectItem>
                      <SelectItem value="Entregue">Entregue</SelectItem>
                      <SelectItem value="Cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4 font-semibold">Data de Criação</div>
                <div>
                  {format(new Date(order.createdAt), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </div>

                <div className="mt-4 font-semibold">Agendado para</div>
                <div>
                  {format(new Date(order.scheduledFor), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </div>

                <div className="mt-4 font-semibold">Técnico Responsável</div>
                <div>{order.technician || "Não atribuído"}</div>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <div className="font-semibold mb-2">Serviços</div>
              {order.services && order.services.length > 0 ? (
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Serviço
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {order.services.map((service, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{service.name}</td>
                          <td className="px-4 py-2 text-right">
                            {formatCurrency(service.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-500">Nenhum serviço registrado</div>
              )}
            </div>

            <div className="mt-4">
              <div className="font-semibold mb-2">Peças</div>
              {order.products && order.products.length > 0 ? (
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Peça
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Qtd
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor Unit.
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {order.products.map((product, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{product.name}</td>
                          <td className="px-4 py-2 text-right">
                            {product.quantity}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {formatCurrency(product.price)}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {formatCurrency(product.subtotal || product.price * product.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-500">Nenhuma peça registrada</div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="payment">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold">Forma de Pagamento</div>
                  <div>{order.paymentMethod || "Não especificado"}</div>
                  
                  {order.downPayment && order.downPayment > 0 && (
                    <div className="mt-4">
                      <div className="font-semibold">Entrada</div>
                      <div>{formatCurrency(order.downPayment)}</div>
                    </div>
                  )}
                  
                  {order.installments && order.installments > 0 && (
                    <div className="mt-4">
                      <div className="font-semibold">Parcelamento</div>
                      <div>{order.installments}x de {formatCurrency(order.installmentAmount || 0)}</div>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold">Mão de obra:</div>
                      <div>{formatCurrency(order.laborValue || 0)}</div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="font-bold text-lg">Total:</div>
                      <div className="font-bold text-lg">{formatCurrency(order.totalPrice)}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {renderInstallmentDates()}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceOrderDetails;
