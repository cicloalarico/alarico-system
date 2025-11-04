import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Supplier } from "@/types";

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setSuppliers(data as Supplier[]);
    } catch (error: any) {
      console.error("Erro ao buscar fornecedores:", error.message);
      toast({
        title: "Erro ao carregar fornecedores",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (supplierData: Omit<Supplier, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([supplierData])
        .select();

      if (error) {
        throw error;
      }

      setSuppliers(prev => [...prev, data[0] as Supplier]);
      toast({
        title: "Fornecedor adicionado",
        description: `${supplierData.name} foi adicionado com sucesso.`,
      });
      
      return data[0] as Supplier;
    } catch (error: any) {
      console.error("Erro ao criar fornecedor:", error.message);
      toast({
        title: "Erro ao adicionar fornecedor",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateSupplier = async (id: number, supplierData: Partial<Supplier>) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .update(supplierData)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      setSuppliers(prev =>
        prev.map(supplier => (supplier.id === id ? { ...supplier, ...data[0] } : supplier))
      );

      toast({
        title: "Fornecedor atualizado",
        description: `Fornecedor atualizado com sucesso.`,
      });
      
      return data[0] as Supplier;
    } catch (error: any) {
      console.error("Erro ao atualizar fornecedor:", error.message);
      toast({
        title: "Erro ao atualizar fornecedor",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteSupplier = async (id: number) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
      toast({
        title: "Fornecedor removido",
        description: "Fornecedor removido com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro ao excluir fornecedor:", error.message);
      toast({
        title: "Erro ao excluir fornecedor",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  };
};
