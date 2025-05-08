
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { ServiceOrder, ServiceStatusType, PriorityType } from '@/types';
import { technicianOptions, initialServiceOrders } from '@/data/serviceOrdersData';

export const useServiceOrders = () => {
  const { toast } = useToast();
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(initialServiceOrders);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedServiceOrder, setSelectedServiceOrder] = useState<ServiceOrder | null>(null);

  // Manipular visualização de uma ordem de serviço
  const handleViewServiceOrder = (order: ServiceOrder) => {
    setSelectedServiceOrder(order);
    setIsViewDialogOpen(true);
  };

  // Manipular criação de uma nova ordem de serviço
  const handleCreateServiceOrder = (data: any) => {
    const orderCount = serviceOrders.length;
    
    // Ensure the priority is valid by checking against allowed values
    const validPriorities: PriorityType[] = ["Baixa", "Normal", "Alta", "Urgente"];
    const priority: PriorityType = validPriorities.includes(data.priority as PriorityType) 
      ? (data.priority as PriorityType) 
      : "Normal";
    
    const newOrder: ServiceOrder = {
      id: `OS2024${String(orderCount + 1).padStart(3, "0")}`,
      customer: data.customer,
      bikeModel: data.bikeModel,
      issueDescription: data.issueDescription,
      status: "Aberta",
      priority,
      createdAt: new Date().toISOString().split("T")[0],
      scheduledFor: data.scheduledFor,
      completedAt: null,
      technician: data.technicianId ? technicianOptions.find(t => t.id === parseInt(data.technicianId))?.name || null : null,
      services: data.services ? data.services.map((s: any) => ({ ...s, id: String(s.id) })) : [],
      products: data.products,
      totalPrice: data.totalPrice,
      notes: data.notes,
      laborValue: data.laborValue || 0, // Add the laborValue field
    };

    setServiceOrders([...serviceOrders, newOrder]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Ordem de serviço criada",
      description: `OS ${newOrder.id} foi criada com sucesso.`,
    });
  };

  // Atualizar status da ordem de serviço
  const handleUpdateStatus = (orderId: string, newStatus: ServiceStatusType) => {
    const updatedOrders = serviceOrders.map(order => {
      if (order.id === orderId) {
        // Create a new object to avoid mutating the original
        const updatedOrder = { ...order, status: newStatus };
        if (newStatus === "Concluída" || newStatus === "Entregue") {
          updatedOrder.completedAt = new Date().toISOString().split("T")[0];
        }
        return updatedOrder;
      }
      return order;
    });

    setServiceOrders(updatedOrders);
    setIsViewDialogOpen(false);
    
    toast({
      title: "Status atualizado",
      description: `A ordem de serviço ${orderId} foi atualizada para "${newStatus}".`,
    });
  };

  return {
    serviceOrders,
    setServiceOrders,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    selectedServiceOrder,
    setSelectedServiceOrder,
    handleViewServiceOrder,
    handleCreateServiceOrder,
    handleUpdateStatus
  };
};
