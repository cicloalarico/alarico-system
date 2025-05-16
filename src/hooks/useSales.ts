import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Sale, SaleCreate, SaleItem, SaleItemCreate, SaleStatusType } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { salesData } from '@/data/salesData';

export const useSales = () => {
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>(salesData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar todas as vendas
  const fetchSales = async () => {
    setLoading(true);
    setError(null);

    try {
      // Buscar vendas
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*, customers(name)')
        .order('date', { ascending: false });

      if (salesError) throw salesError;

      // Buscar itens de venda para cada venda
      const salesWithItems: Sale[] = await Promise.all(
        salesData.map(async (sale) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('sale_items')
            .select('*, products(name)')
            .eq('sale_id', sale.id);

          if (itemsError) throw itemsError;

          const items: SaleItem[] = itemsData.map(item => ({
            id: item.id.toString(),
            productId: item.product_id,
            productName: item.products ? item.products.name : `Produto ${item.product_id}`,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            subtotal: item.subtotal
          }));

          return {
            id: sale.id,
            customerName: sale.customers ? sale.customers.name : 'Cliente não identificado',
            customerId: sale.customer_id,
            date: new Date(sale.date).toISOString().split('T')[0],
            items,
            totalAmount: sale.total_amount,
            paymentMethod: sale.payment_method,
            status: sale.status,
            invoiceNumber: sale.invoice_number,
            notes: sale.notes
          };
        })
      );

      setSales(salesWithItems);
    } catch (err: any) {
      console.error('Erro ao buscar vendas:', err);
      setError(err.message);
      toast({
        title: "Erro",
        description: `Falha ao carregar vendas: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para criar nova venda
  const createSale = async (saleData: Omit<Sale, 'id'>) => {
    setLoading(true);
    setError(null);

    try {
      // Primeiro, inserir a venda
      const saleToCreate: SaleCreate = {
        customer_id: saleData.customerId,
        date: saleData.date,
        total_amount: saleData.totalAmount,
        payment_method: saleData.paymentMethod,
        status: saleData.status,
        invoice_number: saleData.invoiceNumber,
        notes: saleData.notes
      };

      // Usar a função de banco de dados para gerar ID de venda
      const { data: saleId, error: saleError } = await supabase
        .rpc('generate_sale_id');

      if (saleError) throw saleError;

      // Inserir a venda com o ID gerado
      const { data: insertedSale, error: insertError } = await supabase
        .from('sales')
        .insert({ ...saleToCreate, id: saleId })
        .select()
        .single();

      if (insertError) throw insertError;

      // Em seguida, inserir os itens da venda
      const itemsToCreate: SaleItemCreate[] = saleData.items.map(item => ({
        sale_id: insertedSale.id,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: item.subtotal
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(itemsToCreate);

      if (itemsError) throw itemsError;

      // Atualizar o estoque dos produtos
      for (const item of saleData.items) {
        // Utilizando o operador de subtração diretamente na query
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: supabase.rpc('decrement_stock', { amount: item.quantity }) })
          .eq('id', item.productId);

        if (updateError) {
          console.error('Erro ao atualizar estoque:', updateError);
          // Não interrompe o processo, apenas loga o erro
        }
      }

      // Registrar movimento de estoque
      const stockMovements = saleData.items.map(item => ({
        product_id: item.productId,
        quantity: -item.quantity,  // Negativo para indicar saída
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        type: 'saída',
        reason: `Venda ${insertedSale.id}`,
        user_id: 1,  // Usar ID do usuário logado quando implementado
        document: insertedSale.id
      }));

      const { error: movementError } = await supabase
        .from('stock_movements')
        .insert(stockMovements);

      if (movementError) {
        console.error('Erro ao registrar movimento de estoque:', movementError);
        // Não interrompe o processo, apenas loga o erro
      }

      // Buscar dados completos da venda para atualizar o estado
      await fetchSales();

      toast({
        title: "Sucesso",
        description: `Venda ${insertedSale.id} foi registrada com sucesso.`,
      });

      return insertedSale.id;

    } catch (err: any) {
      console.error('Erro ao criar venda:', err);
      setError(err.message);
      toast({
        title: "Erro",
        description: `Falha ao criar venda: ${err.message}`,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar o status de uma venda
  const updateSaleStatus = async (saleId: string, status: SaleStatusType) => {
    try {
      const { error } = await supabase
        .from('sales')
        .update({ status })
        .eq('id', saleId);

      if (error) throw error;

      setSales(prev => prev.map(sale => 
        sale.id === saleId ? { ...sale, status } : sale
      ));

      toast({
        title: "Sucesso",
        description: `Status da venda ${saleId} atualizado para ${status}.`,
      });

      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar status da venda:', err);
      toast({
        title: "Erro",
        description: `Falha ao atualizar status: ${err.message}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Função para excluir uma venda
  const deleteSale = async (saleId: string) => {
    try {
      // Primeiro verifica se existem itens para devolver ao estoque
      const { data: items, error: itemsError } = await supabase
        .from('sale_items')
        .select('*')
        .eq('sale_id', saleId);

      if (itemsError) throw itemsError;

      // Atualizar o estoque dos produtos (devolver ao estoque)
      for (const item of items) {
        // Utilizando o operador de adição diretamente na query
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: supabase.rpc('increment_stock', { amount: item.quantity }) })
          .eq('id', item.product_id);

        if (updateError) {
          console.error('Erro ao atualizar estoque:', updateError);
          // Não interrompe o processo, apenas loga o erro
        }
      }

      // Excluir itens da venda
      const { error: deleteItemsError } = await supabase
        .from('sale_items')
        .delete()
        .eq('sale_id', saleId);

      if (deleteItemsError) throw deleteItemsError;

      // Excluir a venda
      const { error: deleteSaleError } = await supabase
        .from('sales')
        .delete()
        .eq('id', saleId);

      if (deleteSaleError) throw deleteSaleError;

      setSales(prev => prev.filter(sale => sale.id !== saleId));

      toast({
        title: "Sucesso",
        description: `Venda ${saleId} excluída com sucesso.`,
      });

      return true;
    } catch (err: any) {
      console.error('Erro ao excluir venda:', err);
      toast({
        title: "Erro",
        description: `Falha ao excluir venda: ${err.message}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Carregar vendas ao montar o componente
  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    loading,
    error,
    fetchSales,
    createSale,
    updateSaleStatus,
    deleteSale
  };
};
