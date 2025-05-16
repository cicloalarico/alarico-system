
import { useState, useEffect } from 'react';
import { ServiceOrder, ServiceStatusType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { initialServiceOrders } from '@/data/serviceOrdersData';
import { fetchServiceOrders } from '@/utils/serviceOrderFetcher';
import { createServiceOrder, updateServiceOrderStatus } from '@/utils/serviceOrderOperations';

export const useServiceOrders = () => {
  const toast = useToast();
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(initialServiceOrders);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedServiceOrder, setSelectedServiceOrder] = useState<ServiceOrder | null>(null);
  const [loading, setLoading] = useState(false);

  // Manipular visualização de uma ordem de serviço
  const handleViewServiceOrder = (order: ServiceOrder) => {
    setSelectedServiceOrder(order);
    setIsViewDialogOpen(true);
  };

  // Manipular criação de uma nova ordem de serviço
  const handleCreateServiceOrder = async (orderData: Omit<ServiceOrder, 'id'>) => {
    setLoading(true);
    try {
      await createServiceOrder(orderData, setServiceOrders, toast);
      setIsAddDialogOpen(false);
      // Recarregar os dados
      loadServiceOrders();
    } catch (error) {
      console.error('Error in handleCreateServiceOrder:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status da ordem de serviço
  const handleUpdateStatus = async (orderId: string, newStatus: ServiceStatusType) => {
    try {
      await updateServiceOrderStatus(orderId, newStatus, setServiceOrders, toast);
      setIsViewDialogOpen(false);
    } catch (error) {
      console.error('Error in handleUpdateStatus:', error);
    }
  };

  // Função para carregar ordens de serviço
  const loadServiceOrders = async () => {
    setLoading(true);
    try {
      const orders = await fetchServiceOrders(toast);
      setServiceOrders(orders);
    } catch (error) {
      console.error('Error fetching service orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar ordens de serviço ao iniciar
  useEffect(() => {
    loadServiceOrders();
  }, []);

  return {
    serviceOrders,
    setServiceOrders,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    selectedServiceOrder,
    setSelectedServiceOrder,
    loading,
    handleViewServiceOrder,
    handleCreateServiceOrder,
    handleUpdateStatus,
    fetchServiceOrders: loadServiceOrders
  };
};
