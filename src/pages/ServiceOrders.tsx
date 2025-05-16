
import React, { useEffect, useState } from "react";
import ServiceOrderHeader from "@/components/service-orders/ServiceOrderHeader";
import ServiceOrdersFilter from "@/components/service-orders/ServiceOrdersFilter";
import ServiceOrdersList from "@/components/service-orders/ServiceOrdersList";
import ServiceOrderForm from "@/components/service-orders/ServiceOrderForm";
import ServiceOrderDetails from "@/components/service-orders/ServiceOrderDetails";
import { useServiceOrders } from "@/hooks/useServiceOrders";
import { useServiceOrdersFilter } from "@/hooks/useServiceOrdersFilter";
import { priorityOptions } from "@/data/serviceOrdersData";
import { useCustomers } from "@/hooks/useCustomers";
import { useProducts } from "@/hooks/useProducts";
import { useServices } from "@/hooks/useServices";

const ServiceOrders = () => {
  const {
    serviceOrders,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    selectedServiceOrder,
    handleViewServiceOrder,
    handleCreateServiceOrder,
    handleUpdateStatus
  } = useServiceOrders();

  const { customers } = useCustomers();
  const { products } = useProducts();
  const { services } = useServices();
  
  // Get technicians from the database (in a real app)
  const [technicianOptions, setTechnicianOptions] = useState([
    { id: 1, name: "João Silva" },
    { id: 2, name: "Maria Santos" },
    { id: 3, name: "Carlos Oliveira" }
  ]);

  const {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    filteredServiceOrders
  } = useServiceOrdersFilter(serviceOrders);

  return (
    <div className="space-y-6">
      <ServiceOrderHeader 
        isAddDialogOpen={isAddDialogOpen} 
        setIsAddDialogOpen={setIsAddDialogOpen} 
      />

      <ServiceOrdersFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <ServiceOrdersList
        orders={filteredServiceOrders}
        onViewDetails={handleViewServiceOrder}
      />

      <ServiceOrderForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleCreateServiceOrder}
        customers={customers}
        serviceOptions={services}
        productOptions={products}
        technicianOptions={technicianOptions}
        priorityOptions={priorityOptions}
      />

      <ServiceOrderDetails
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        order={selectedServiceOrder}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default ServiceOrders;
