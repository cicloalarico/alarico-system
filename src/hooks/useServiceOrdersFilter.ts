
import { useState, useMemo } from 'react';
import { ServiceOrder } from '@/types';
import { ServiceStatusType } from '@/components/service-orders/ServiceStatus';

export const useServiceOrdersFilter = (serviceOrders: ServiceOrder[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredServiceOrders = useMemo(() => {
    return serviceOrders.filter((order) => {
      // Filter by search term
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.bikeModel.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by tab
      if (activeTab === "all") {
        return matchesSearch;
      } else if (activeTab === "pending") {
        return matchesSearch && ["Aberta", "Em andamento", "Aguardando peças"].includes(order.status);
      } else if (activeTab === "completed") {
        return matchesSearch && ["Concluída", "Entregue"].includes(order.status);
      }
      
      return matchesSearch;
    });
  }, [serviceOrders, searchTerm, activeTab]);

  return {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    filteredServiceOrders
  };
};
