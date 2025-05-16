
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  active: boolean;
}

interface ServiceFormData {
  name: string;
  description: string;
  price: number;
  category?: string;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name");

      if (error) throw error;

      // Convert numeric ids to strings to match the Service interface
      const formattedServices = data.map(service => ({
        ...service,
        id: service.id.toString()
      })) as Service[];

      setServices(formattedServices);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch services"));
      toast.error("Falha ao carregar serviços");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateService = async (formData: ServiceFormData) => {
    try {
      const newService = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category || null,
        active: true,
      };

      const { data, error } = await supabase
        .from("services")
        .insert(newService)
        .select();

      if (error) throw error;

      const createdService = data[0];
      // Convert numeric id to string
      const serviceWithStringId = {
        ...createdService,
        id: createdService.id.toString()
      } as Service;

      setServices([...services, serviceWithStringId]);
      toast.success("Serviço adicionado com sucesso!");
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error("Error creating service:", err);
      toast.error("Erro ao adicionar serviço");
    }
  };

  const handleUpdateService = async (id: string, formData: ServiceFormData) => {
    try {
      const updatedService = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category || null,
      };

      // Convert string id to number for the database
      const numericId = parseInt(id);

      const { error } = await supabase
        .from("services")
        .update(updatedService)
        .eq("id", numericId);

      if (error) throw error;

      setServices(services.map(service => 
        service.id === id
          ? { ...service, ...updatedService }
          : service
      ));
      
      toast.success("Serviço atualizado com sucesso!");
      setIsEditDialogOpen(false);
      setSelectedService(null);
    } catch (err) {
      console.error("Error updating service:", err);
      toast.error("Erro ao atualizar serviço");
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      // Convert string id to number for the database
      const numericId = parseInt(id);
      
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", numericId);

      if (error) throw error;

      setServices(services.filter(service => service.id !== id));
      toast.success("Serviço excluído com sucesso!");
    } catch (err) {
      console.error("Error deleting service:", err);
      toast.error("Erro ao excluir serviço");
    }
  };

  const handleViewService = (service: Service) => {
    setSelectedService(service);
    setIsEditDialogOpen(true);
  };

  return {
    services,
    isLoading,
    error,
    fetchServices,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedService,
    handleCreateService,
    handleUpdateService,
    handleDeleteService,
    handleViewService,
  };
};
