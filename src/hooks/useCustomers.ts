
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/types";

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setCustomers(data as Customer[]);
    } catch (error: any) {
      console.error("Erro ao buscar clientes:", error.message);
      toast({
        title: "Erro ao carregar clientes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customerData: Omit<Customer, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select();

      if (error) {
        throw error;
      }

      setCustomers(prev => [...prev, data[0] as Customer]);
      toast({
        title: "Cliente adicionado",
        description: `${customerData.name} foi adicionado com sucesso.`,
      });
      
      return data[0] as Customer;
    } catch (error: any) {
      console.error("Erro ao criar cliente:", error.message);
      toast({
        title: "Erro ao adicionar cliente",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCustomer = async (id: number, customerData: Partial<Customer>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      setCustomers(prev =>
        prev.map(customer => (customer.id === id ? { ...customer, ...data[0] } : customer))
      );

      toast({
        title: "Cliente atualizado",
        description: `Cliente atualizado com sucesso.`,
      });
      
      return data[0] as Customer;
    } catch (error: any) {
      console.error("Erro ao atualizar cliente:", error.message);
      toast({
        title: "Erro ao atualizar cliente",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCustomer = async (id: number) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setCustomers(prev => prev.filter(customer => customer.id !== id));
      toast({
        title: "Cliente removido",
        description: "Cliente removido com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro ao excluir cliente:", error.message);
      toast({
        title: "Erro ao excluir cliente",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};
