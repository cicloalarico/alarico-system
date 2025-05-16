
import { supabase } from '@/integrations/supabase/client';
import { ServiceOrder } from '@/types';
import { technicianOptions } from '@/data/serviceOrdersData';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

/**
 * Fetches all service orders from the database
 */
export const fetchServiceOrders = async (
  toast: ReturnType<typeof useToast>
): Promise<ServiceOrder[]> => {
  try {
    // Buscar ordens de serviço
    const { data: ordersData, error: ordersError } = await supabase
      .from('service_orders')
      .select('*, customers(name)')
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    // Buscar itens de serviços para cada ordem
    const ordersWithDetails = await Promise.all(
      ordersData.map(async (order) => {
        // Buscar serviços
        const { data: services, error: servicesError } = await supabase
          .from('service_items')
          .select('*')
          .eq('service_order_id', order.id);

        if (servicesError) throw servicesError;

        // Buscar produtos
        const { data: products, error: productsError } = await supabase
          .from('service_product_items')
          .select('*, products(*)')
          .eq('service_order_id', order.id);

        if (productsError) throw productsError;

        const formattedOrder: ServiceOrder = {
          id: order.id,
          customer: order.customers ? order.customers.name : 'Cliente não identificado',
          bikeModel: order.bike_model,
          issueDescription: order.issue_description,
          status: order.status,
          priority: order.priority,
          createdAt: format(new Date(order.created_at), 'yyyy-MM-dd'),
          scheduledFor: order.scheduled_for,
          completedAt: order.completed_at ? format(new Date(order.completed_at), 'yyyy-MM-dd') : null,
          technician: order.technician_id ? technicianOptions.find(t => t.id === order.technician_id)?.name || null : null,
          services: services ? services.map(s => ({
            id: s.id.toString(),
            name: s.name,
            price: s.price
          })) : [],
          products: products ? products.map(p => ({
            id: p.id.toString(),
            name: p.products ? p.products.name : `Produto ${p.product_id}`,
            quantity: p.quantity,
            price: p.price,
            subtotal: p.subtotal
          })) : [],
          totalPrice: order.total_price,
          notes: order.notes || undefined,
          laborValue: order.labor_value || 0,
          paymentMethod: order.payment_method || undefined,
          downPayment: order.down_payment,
          installments: order.installments,
          installmentAmount: order.installment_amount,
          firstInstallmentDate: order.first_installment_date
        };

        return formattedOrder;
      })
    );

    return ordersWithDetails;
  } catch (err: any) {
    console.error('Erro ao buscar ordens de serviço:', err);
    toast.toast({
      title: "Erro",
      description: `Falha ao carregar ordens de serviço: ${err.message}`,
      variant: "destructive",
    });
    throw err;
  }
};
