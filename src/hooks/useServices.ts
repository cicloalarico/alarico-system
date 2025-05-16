
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ServiceItem } from "@/types";

interface Service {
  id: string;
  name: string;
  price: number;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      // First fetch pre-loaded services from service_items
      const { data: serviceItems, error: serviceItemsError } = await supabase
        .from('service_items')
        .select('*')
        .order('name');

      if (serviceItemsError) {
        throw serviceItemsError;
      }

      // Convert to unique services (by name, taking the most recent price)
      const uniqueServices = new Map<string, Service>();
      serviceItems?.forEach((item) => {
        uniqueServices.set(item.name, {
          id: String(item.id),
          name: item.name,
          price: item.price
        });
      });

      setServices(Array.from(uniqueServices.values()));
    } catch (error: any) {
      console.error("Erro ao buscar serviços:", error.message);
      toast({
        title: "Erro ao carregar serviços",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData: Omit<Service, "id">) => {
    try {
      const { data, error } = await supabase
        .from('service_items')
        .insert([{
          name: serviceData.name,
          price: serviceData.price,
          service_order_id: 'TEMPLATE' // Using TEMPLATE as a marker for service templates
        }])
        .select();

      if (error) {
        throw error;
      }

      const newService = {
        id: String(data[0].id),
        name: data[0].name,
        price: data[0].price
      };

      setServices(prev => [...prev, newService]);
      
      toast({
        title: "Serviço adicionado",
        description: `${serviceData.name} foi adicionado com sucesso.`,
      });
      
      return newService;
    } catch (error: any) {
      console.error("Erro ao criar serviço:", error.message);
      toast({
        title: "Erro ao adicionar serviço",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateService = async (id: string, serviceData: Partial<Service>) => {
    try {
      const { data, error } = await supabase
        .from('service_items')
        .update({
          name: serviceData.name,
          price: serviceData.price
        })
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      setServices(prev =>
        prev.map(service => (service.id === id ? { 
          ...service, 
          ...serviceData 
        } : service))
      );

      toast({
        title: "Serviço atualizado",
        description: `Serviço atualizado com sucesso.`,
      });
      
      return data[0] as Service;
    } catch (error: any) {
      console.error("Erro ao atualizar serviço:", error.message);
      toast({
        title: "Erro ao atualizar serviço",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('service_items')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setServices(prev => prev.filter(service => service.id !== id));
      
      toast({
        title: "Serviço removido",
        description: "Serviço removido com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro ao excluir serviço:", error.message);
      toast({
        title: "Erro ao excluir serviço",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    fetchServices,
    createService,
    updateService,
    deleteService,
  };
};
