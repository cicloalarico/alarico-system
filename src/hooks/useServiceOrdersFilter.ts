
import { useState, useMemo } from "react";
import { ServiceOrder, ServiceStatusType } from "@/types/serviceOrders";

export const useServiceOrdersFilter = (serviceOrders: ServiceOrder[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<ServiceStatusType | "Todas">("Todas");

  const filteredServiceOrders = useMemo(() => {
    return serviceOrders.filter((order) => {
      // Status filter
      if (activeTab !== "Todas" && order.status !== activeTab) {
        return false;
      }
      
      // Search filter
      if (searchTerm) {
        const customerName = typeof order.customer === 'string' 
          ? order.customer.toLowerCase() 
          : order.customer?.name?.toLowerCase() || '';
        
        const searchTermLower = searchTerm.toLowerCase();
        
        return (
          customerName.includes(searchTermLower) ||
          order.bikeModel.toLowerCase().includes(searchTermLower) ||
          order.id.toLowerCase().includes(searchTermLower)
        );
      }
      
      return true;
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
