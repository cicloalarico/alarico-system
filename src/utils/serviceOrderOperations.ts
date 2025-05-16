
import { supabase } from '@/integrations/supabase/client';
import { ServiceOrder, ServiceStatusType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { technicianOptions } from '@/data/serviceOrdersData';
import { generateFinancialTransactions } from './serviceOrderFinancials';

/**
 * Creates a new service order
 */
export const createServiceOrder = async (
  orderData: Omit<ServiceOrder, 'id'>,
  setServiceOrders: React.Dispatch<React.SetStateAction<ServiceOrder[]>>,
  toast: ReturnType<typeof useToast>
) => {
  try {
    // Usar a função de banco de dados para gerar ID de ordem de serviço
    const { data: orderId, error: idError } = await supabase
      .rpc('generate_service_order_id');

    if (idError) throw idError;

    // Ensure the priority is valid by checking against allowed values
    const validPriorities = ["Baixa", "Normal", "Alta", "Urgente"];
    const priority = validPriorities.includes(orderData.priority as any) 
      ? orderData.priority 
      : "Normal";

    // We need a variable to hold the new order before inserting
    const customerId = typeof orderData.customer === 'object' && orderData.customer !== null 
      ? (orderData.customer as any).id 
      : parseInt(orderData.customer as unknown as string, 10);
      
    const technicianId = orderData.technician 
      ? parseInt(orderData.technician.toString()) 
      : null;

    // Inserir a ordem de serviço
    const { data: orderData2, error: orderError } = await supabase
      .from('service_orders')
      .insert({
        id: orderId,
        customer_id: customerId,
        bike_model: orderData.bikeModel,
        issue_description: orderData.issueDescription,
        status: "Aberta",
        priority: priority,
        scheduled_for: orderData.scheduledFor,
        technician_id: technicianId,
        total_price: orderData.totalPrice,
        notes: orderData.notes,
        labor_value: orderData.laborValue || 0,
        payment_method: orderData.paymentMethod,
        down_payment: orderData.downPayment,
        installments: orderData.installments,
        installment_amount: orderData.installmentAmount,
        first_installment_date: orderData.firstInstallmentDate
      })
      .select();

    if (orderError) throw orderError;

    // Inserir os serviços
    if (orderData.services && orderData.services.length > 0) {
      const servicesToInsert = orderData.services.map((service: any) => ({
        service_order_id: orderId,
        name: service.name,
        price: service.price
      }));

      const { error: servicesError } = await supabase
        .from('service_items')
        .insert(servicesToInsert);

      if (servicesError) throw servicesError;
    }

    // Inserir os produtos e atualizar estoque
    if (orderData.products && orderData.products.length > 0) {
      const productsToInsert = orderData.products.map((product: any) => ({
        service_order_id: orderId,
        product_id: product.id,
        quantity: product.quantity,
        price: product.price,
        subtotal: product.subtotal
      }));

      const { error: productsError } = await supabase
        .from('service_product_items')
        .insert(productsToInsert);

      if (productsError) throw productsError;

      // Atualizar estoque dos produtos
      for (const product of productsToInsert) {
        // First, call the RPC function to get the new stock value
        const { data: newStock, error: rpcError } = await supabase
          .rpc('decrement_stock', { 
            product_id: product.product_id, 
            amount: product.quantity 
          });
        
        if (rpcError) {
          console.error('Erro ao atualizar estoque:', rpcError);
          // Continua o processo
          continue;
        }
        
        // Then update the product with the new stock value
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', product.product_id);

        if (updateError) {
          console.error('Erro ao atualizar estoque:', updateError);
          // Continua o processo
        }
      }
    }

    // Criar a ordem de serviço formatada
    const newOrder: ServiceOrder = {
      id: orderId,
      customer: orderData.customer,
      bikeModel: orderData.bikeModel,
      issueDescription: orderData.issueDescription,
      status: "Aberta",
      priority,
      createdAt: new Date().toISOString().split('T')[0],
      scheduledFor: orderData.scheduledFor,
      completedAt: null,
      technician: orderData.technician ? technicianOptions.find(t => t.id === parseInt(orderData.technician!.toString()))?.name || null : null,
      services: orderData.services ? orderData.services.map((s: any) => ({ ...s, id: String(s.id) })) : [],
      products: orderData.products,
      totalPrice: orderData.totalPrice,
      notes: orderData.notes,
      laborValue: orderData.laborValue || 0,
      paymentMethod: orderData.paymentMethod,
      downPayment: orderData.downPayment,
      installments: orderData.installments,
      installmentAmount: orderData.installmentAmount,
      firstInstallmentDate: orderData.firstInstallmentDate
    };

    setServiceOrders(prev => [...prev, newOrder]);
    
    // Gerar as transações financeiras
    const transactions = await generateFinancialTransactions(newOrder, toast);
    
    toast.toast({
      title: "Ordem de serviço criada",
      description: `OS ${newOrder.id} foi criada com sucesso.`,
    });
    
    // Mostra uma mensagem adicional se foram criadas parcelas a receber
    if (transactions.length > 1) {
      toast.toast({
        title: "Parcelas a receber criadas",
        description: `Foram geradas ${transactions.length - (newOrder.downPayment ? 1 : 0)} parcelas no financeiro.`,
      });
    }
    
    return newOrder;
  } catch (err: any) {
    console.error('Erro ao criar ordem de serviço:', err);
    toast.toast({
      title: "Erro",
      description: `Falha ao criar ordem de serviço: ${err.message}`,
      variant: "destructive",
    });
    throw err;
  }
};

/**
 * Updates the status of a service order
 */
export const updateServiceOrderStatus = async (
  orderId: string, 
  newStatus: ServiceStatusType,
  setServiceOrders: React.Dispatch<React.SetStateAction<ServiceOrder[]>>,
  toast: ReturnType<typeof useToast>
) => {
  try {
    const updateData: any = { status: newStatus };
    
    if (newStatus === "Concluída" || newStatus === "Entregue") {
      updateData.completed_at = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from('service_orders')
      .update(updateData)
      .eq('id', orderId);
    
    if (error) throw error;

    setServiceOrders(prevOrders => prevOrders.map(order => {
      if (order.id === orderId) {
        // Create a new object to avoid mutating the original
        const updatedOrder = { 
          ...order, 
          status: newStatus,
        };
        if (newStatus === "Concluída" || newStatus === "Entregue") {
          updatedOrder.completedAt = new Date().toISOString().split('T')[0];
        }
        return updatedOrder;
      }
      return order;
    }));
    
    toast.toast({
      title: "Status atualizado",
      description: `A ordem de serviço ${orderId} foi atualizada para "${newStatus}".`,
    });
    
    return true;
  } catch (err: any) {
    console.error('Erro ao atualizar status da ordem de serviço:', err);
    toast.toast({
      title: "Erro",
      description: `Falha ao atualizar status: ${err.message}`,
      variant: "destructive",
    });
    throw err;
  }
};
