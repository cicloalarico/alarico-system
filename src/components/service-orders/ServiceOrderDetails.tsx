
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  User, 
  Bike, 
  AlertCircle, 
  Printer, 
  CheckCircle, 
  XCircle, 
  Clock,
  Wrench
} from "lucide-react";
import { ServiceStatusType } from './ServiceStatus';
import ServiceStatus from './ServiceStatus';

interface ServiceOrderDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    customer: string;
    bikeModel: string;
    issueDescription: string;
    status: ServiceStatusType;
    priority: string;
    createdAt: string;
    scheduledFor: string;
    completedAt: string | null;
    technician: string | null;
    services: Array<{
      id: number;
      name: string;
      price: number;
    }>;
    products: Array<{
      id: number;
      name: string;
      quantity: number;
      price: number;
      subtotal: number;
    }>;
    totalPrice: number;
    notes: string;
  } | null;
  onUpdateStatus?: (orderId: string, status: ServiceStatusType) => void;
}

const ServiceOrderDetails: React.FC<ServiceOrderDetailsProps> = ({ 
  isOpen, 
  onClose, 
  order,
  onUpdateStatus
}) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>OS: {order.id}</span>
            <ServiceStatus status={order.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <User className="h-4 w-4 mr-1" /> Cliente
                </h3>
                <p className="font-medium">{order.customer}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <Bike className="h-4 w-4 mr-1" /> Bicicleta
                </h3>
                <p>{order.bikeModel}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> Problema Relatado
                </h3>
                <p>{order.issueDescription}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" /> Datas
                </h3>
                <p>Abertura: {order.createdAt}</p>
                <p>Agendamento: {order.scheduledFor}</p>
                {order.completedAt && (
                  <p>Conclusão: {order.completedAt}</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <Wrench className="h-4 w-4 mr-1" /> Técnico
                </h3>
                <p>{order.technician || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Prioridade</h3>
                <p>{order.priority}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Serviços</h3>
            {order.services.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serviço</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell className="text-right">
                          R$ {service.price.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-gray-500">Nenhum serviço registrado</p>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Produtos</h3>
            {order.products.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead className="w-20 text-center">Qtd</TableHead>
                      <TableHead className="text-right">Valor Unit.</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="text-center">
                          {product.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          R$ {product.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          R$ {product.subtotal.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-gray-500">Nenhum produto registrado</p>
            )}
          </div>

          {order.notes && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Observações</h3>
              <p>{order.notes}</p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-md mt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span>R$ {order.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {onUpdateStatus && order.status !== "Concluída" && order.status !== "Entregue" && order.status !== "Cancelada" && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Atualizar Status</h3>
              <div className="flex flex-wrap gap-2">
                {order.status !== "Em andamento" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
                    onClick={() => onUpdateStatus(order.id, "Em andamento")}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Em andamento
                  </Button>
                )}
                {order.status !== "Aguardando peças" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200"
                    onClick={() => onUpdateStatus(order.id, "Aguardando peças")}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Aguardando peças
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                  onClick={() => onUpdateStatus(order.id, "Concluída")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Concluída
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
                  onClick={() => onUpdateStatus(order.id, "Entregue")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Entregue
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                  onClick={() => onUpdateStatus(order.id, "Cancelada")}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancelada
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Imprimir OS
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceOrderDetails;
