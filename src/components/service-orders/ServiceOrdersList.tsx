
import React from "react";
import ServiceOrderCard from "@/components/service-orders/ServiceOrderCard";
import { ServiceOrder } from "@/types";

interface ServiceOrdersListProps {
  orders: ServiceOrder[];
  onViewDetails: (order: ServiceOrder) => void;
}

const ServiceOrdersList: React.FC<ServiceOrdersListProps> = ({ orders, onViewDetails }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-100">
        <div className="text-gray-500">Nenhuma ordem de serviço encontrada</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <ServiceOrderCard 
          key={order.id} 
          order={order} 
          onViewDetails={onViewDetails} 
        />
      ))}
    </div>
  );
};

export default ServiceOrdersList;
