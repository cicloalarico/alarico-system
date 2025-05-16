
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ServiceOrder } from "@/types/serviceOrders";
import ServiceStatus from "./ServiceStatus";

interface ServiceOrderCardProps {
  order: ServiceOrder;
  onViewDetails: (order: ServiceOrder) => void;
}

const ServiceOrderCard = ({ order, onViewDetails }: ServiceOrderCardProps) => {
  const formattedDate = format(new Date(order.createdAt), "dd/MM/yyyy", {
    locale: ptBR,
  });

  // Handle display of customer name based on type
  const getCustomerName = () => {
    if (typeof order.customer === 'string') {
      return order.customer;
    } else if (order.customer && typeof order.customer === 'object') {
      return order.customer.name;
    }
    return "Cliente não especificado";
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-semibold text-lg">{getCustomerName()}</div>
            <div className="text-sm text-gray-500">{order.bikeModel}</div>
            <div className="text-sm text-gray-500 mt-1">OS #{order.id.slice(-6)}</div>
            <div className="text-sm text-gray-500">Criada em: {formattedDate}</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <ServiceStatus status={order.status} />
            <Button onClick={() => onViewDetails(order)} size="sm" variant="outline" className="flex items-center gap-1">
              <Eye className="h-4 w-4" /> Detalhes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceOrderCard;
