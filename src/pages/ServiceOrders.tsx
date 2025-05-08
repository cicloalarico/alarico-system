
import React from "react";
import ServiceOrderHeader from "@/components/service-orders/ServiceOrderHeader";
import ServiceOrdersFilter from "@/components/service-orders/ServiceOrdersFilter";
import ServiceOrdersList from "@/components/service-orders/ServiceOrdersList";
import ServiceOrderForm from "@/components/service-orders/ServiceOrderForm";
import ServiceOrderDetails from "@/components/service-orders/ServiceOrderDetails";
import { useServiceOrders } from "@/hooks/useServiceOrders";
import { useServiceOrdersFilter } from "@/hooks/useServiceOrdersFilter";
import { 
  customerOptions,
  serviceOptions,
  productOptions,
  technicianOptions,
  priorityOptions
} from "@/data/serviceOrdersData";

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

      {/* The TabsContent from ServiceOrdersFilter will wrap this content */}
      <ServiceOrdersList
        orders={filteredServiceOrders}
        onViewDetails={handleViewServiceOrder}
      />

      {/* Forms and Dialogs */}
      <ServiceOrderForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleCreateServiceOrder}
        customers={customerOptions}
        serviceOptions={serviceOptions}
        productOptions={productOptions}
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
