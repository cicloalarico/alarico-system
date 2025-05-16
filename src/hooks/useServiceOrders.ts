
import { useState, useEffect } from 'react';
import { ServiceOrder, ServiceItem, ProductItem, ServiceStatusType, PriorityType } from '@/types';
import { PaymentMethodType, TransactionStatusType } from '@/types/common';
import { FinancialTransaction } from '@/types/financial';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { technicianOptions, initialServiceOrders } from '@/data/serviceOrdersData';
import { format, addMonths } from 'date-fns';

export const useServiceOrders = () => {
  const { toast } = useToast();
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(initialServiceOrders);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedServiceOrder, setSelectedServiceOrder] = useState<ServiceOrder | null>(null);
  const [loading, setLoading] = useState(false);

  // Função para buscar todas as ordens de serviço
  const fetchServiceOrders = async () => {
    setLoading(true);
    
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
            paymentMethod: order.payment_method as PaymentMethodType || undefined,
            downPayment: order.down_payment,
            installments: order.installments,
            installmentAmount: order.installment_amount,
            firstInstallmentDate: order.first_installment_date
          };

          return formattedOrder;
        })
      );

      setServiceOrders(ordersWithDetails);
    } catch (err: any) {
      console.error('Erro ao buscar ordens de serviço:', err);
      toast({
        title: "Erro",
        description: `Falha ao carregar ordens de serviço: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Manipular visualização de uma ordem de serviço
  const handleViewServiceOrder = (order: ServiceOrder) => {
    setSelectedServiceOrder(order);
    setIsViewDialogOpen(true);
  };

  // Gerar transações financeiras baseadas em uma ordem de serviço
  const generateFinancialTransactions = async (order: ServiceOrder): Promise<FinancialTransaction[]> => {
    const transactions: FinancialTransaction[] = [];
    
    try {
      // Se for à vista (dinheiro ou PIX), cria uma única transação
      if (order.paymentMethod === "Dinheiro" || order.paymentMethod === "PIX") {
        // Usar a função de banco de dados para gerar ID da transação
        const { data: transactionId, error: idError } = await supabase
          .rpc('generate_financial_transaction_id');

        if (idError) throw idError;

        // Inserir transação financeira
        const { data, error } = await supabase
          .from('financial_transactions')
          .insert({
            id: transactionId,
            date: new Date().toISOString().split('T')[0],
            description: `Pagamento OS ${order.id} - ${order.customer}`,
            category: "serviços",
            amount: order.totalPrice,
            type: "receita",
            payment_method: order.paymentMethod,
            status: "pago",
            related_id: order.id,
            notes: `Pagamento à vista - OS ${order.id}`
          })
          .select();

        if (error) throw error;

        if (data && data[0]) {
          const transaction: FinancialTransaction = {
            id: data[0].id,
            date: data[0].date,
            description: data[0].description,
            category: data[0].category,
            amount: data[0].amount,
            type: data[0].type,
            paymentMethod: data[0].payment_method,
            status: data[0].status,
            relatedId: data[0].related_id,
            notes: data[0].notes
          };
          transactions.push(transaction);
        }
      }
      // Se for cartão, cria uma única transação pendente
      else if (order.paymentMethod === "Cartão de Crédito" || order.paymentMethod === "Cartão de Débito") {
        // Usar a função de banco de dados para gerar ID da transação
        const { data: transactionId, error: idError } = await supabase
          .rpc('generate_financial_transaction_id');

        if (idError) throw idError;

        // Inserir transação financeira
        const { data, error } = await supabase
          .from('financial_transactions')
          .insert({
            id: transactionId,
            date: new Date().toISOString().split('T')[0],
            description: `Pagamento OS ${order.id} - ${order.customer}`,
            category: "serviços",
            amount: order.totalPrice,
            type: "receita",
            payment_method: order.paymentMethod,
            status: "pendente",
            due_date: format(new Date(order.createdAt), 'yyyy-MM-dd'),
            related_id: order.id,
            notes: `Pagamento com cartão - OS ${order.id}`
          })
          .select();

        if (error) throw error;

        if (data && data[0]) {
          const transaction: FinancialTransaction = {
            id: data[0].id,
            date: data[0].date,
            description: data[0].description,
            category: data[0].category,
            amount: data[0].amount,
            type: data[0].type,
            paymentMethod: data[0].payment_method,
            status: data[0].status,
            dueDate: data[0].due_date,
            relatedId: data[0].related_id,
            notes: data[0].notes
          };
          transactions.push(transaction);
        }
      }
      // Se for crediário, cria transações para entrada e parcelas
      else if (order.paymentMethod === "Crediário Loja" && order.firstInstallmentDate) {
        // Transação para entrada se houver
        if (order.downPayment && order.downPayment > 0) {
          // Usar a função de banco de dados para gerar ID da transação
          const { data: transactionId, error: idError } = await supabase
            .rpc('generate_financial_transaction_id');

          if (idError) throw idError;

          // Inserir transação de entrada
          const { data, error } = await supabase
            .from('financial_transactions')
            .insert({
              id: transactionId,
              date: new Date().toISOString().split('T')[0],
              description: `Entrada OS ${order.id} - ${order.customer}`,
              category: "serviços",
              amount: order.downPayment,
              type: "receita",
              payment_method: "Dinheiro",
              status: "pago",
              related_id: order.id,
              notes: `Entrada do crediário - OS ${order.id}`
            })
            .select();

          if (error) throw error;

          if (data && data[0]) {
            const transaction: FinancialTransaction = {
              id: data[0].id,
              date: data[0].date,
              description: data[0].description,
              category: data[0].category,
              amount: data[0].amount,
              type: data[0].type,
              paymentMethod: data[0].payment_method,
              status: data[0].status,
              relatedId: data[0].related_id,
              notes: data[0].notes
            };
            transactions.push(transaction);
          }
        }
        
        // Transações para parcelas
        if (order.installments && order.installmentAmount) {
          const firstDate = new Date(order.firstInstallmentDate);
          
          for (let i = 0; i < order.installments; i++) {
            const dueDate = format(addMonths(firstDate, i), 'yyyy-MM-dd');
            
            // Usar a função de banco de dados para gerar ID da transação
            const { data: transactionId, error: idError } = await supabase
              .rpc('generate_financial_transaction_id');

            if (idError) throw idError;

            const installmentId = `${transactionId}-P${i+1}`;

            // Inserir transação de parcela
            const { data, error } = await supabase
              .from('financial_transactions')
              .insert({
                id: installmentId,
                date: new Date().toISOString().split('T')[0],
                description: `Parcela ${i+1}/${order.installments} - OS ${order.id} - ${order.customer}`,
                category: "serviços",
                amount: order.installmentAmount,
                type: "receita",
                payment_method: "Crediário Loja",
                status: "pendente",
                due_date: dueDate,
                related_id: order.id,
                notes: `Parcela ${i+1} de ${order.installments} - OS ${order.id}`
              })
              .select();

            if (error) throw error;

            if (data && data[0]) {
              const transaction: FinancialTransaction = {
                id: data[0].id,
                date: data[0].date,
                description: data[0].description,
                category: data[0].category,
                amount: data[0].amount,
                type: data[0].type,
                paymentMethod: data[0].payment_method,
                status: data[0].status,
                dueDate: data[0].due_date,
                relatedId: data[0].related_id,
                notes: data[0].notes
              };
              transactions.push(transaction);
            }
          }
        }
      }
      
      return transactions;
    } catch (err: any) {
      console.error('Erro ao gerar transações financeiras:', err);
      toast({
        title: "Erro",
        description: `Falha ao gerar transações financeiras: ${err.message}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Manipular criação de uma nova ordem de serviço
  const handleCreateServiceOrder = async (orderData: Omit<ServiceOrder, 'id'>) => {
    setLoading(true);
    
    try {
      // Usar a função de banco de dados para gerar ID de ordem de serviço
      const { data: orderId, error: idError } = await supabase
        .rpc('generate_service_order_id');

      if (idError) throw idError;

      // Ensure the priority is valid by checking against allowed values
      const validPriorities: PriorityType[] = ["Baixa", "Normal", "Alta", "Urgente"];
      const priority: PriorityType = validPriorities.includes(orderData.priority as PriorityType) 
        ? (orderData.priority as PriorityType) 
        : "Normal";

      // We need a variable to hold the new order before inserting
      const customerId = typeof orderData.customer === 'object' && orderData.customer !== null 
        ? orderData.customer.id 
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
          payment_method: orderData.paymentMethod as PaymentMethodType,
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
          const { error: updateError } = await supabase
            .from('products')
            .update({ stock: supabase.rpc('decrement_stock', { amount: product.quantity, product_id: product.product_id }) })
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
        paymentMethod: orderData.paymentMethod as PaymentMethodType,
        downPayment: orderData.downPayment,
        installments: orderData.installments,
        installmentAmount: orderData.installmentAmount,
        firstInstallmentDate: orderData.firstInstallmentDate
      };

      setServiceOrders([...serviceOrders, newOrder]);
      setIsAddDialogOpen(false);
      
      // Gerar as transações financeiras
      const transactions = await generateFinancialTransactions(newOrder);
      
      toast({
        title: "Ordem de serviço criada",
        description: `OS ${newOrder.id} foi criada com sucesso.`,
      });
      
      // Mostra uma mensagem adicional se foram criadas parcelas a receber
      if (transactions.length > 1) {
        toast({
          title: "Parcelas a receber criadas",
          description: `Foram geradas ${transactions.length - (newOrder.downPayment ? 1 : 0)} parcelas no financeiro.`,
        });
      }

      // Recarregar os dados
      fetchServiceOrders();
      
    } catch (err: any) {
      console.error('Erro ao criar ordem de serviço:', err);
      toast({
        title: "Erro",
        description: `Falha ao criar ordem de serviço: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status da ordem de serviço
  const handleUpdateStatus = async (orderId: string, newStatus: ServiceStatusType) => {
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

      const updatedOrders = serviceOrders.map(order => {
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
      });

      setServiceOrders(updatedOrders);
      setIsViewDialogOpen(false);
      
      toast({
        title: "Status atualizado",
        description: `A ordem de serviço ${orderId} foi atualizada para "${newStatus}".`,
      });
    } catch (err: any) {
      console.error('Erro ao atualizar status da ordem de serviço:', err);
      toast({
        title: "Erro",
        description: `Falha ao atualizar status: ${err.message}`,
        variant: "destructive",
      });
    }
  };

  // Carregar ordens de serviço ao iniciar
  useEffect(() => {
    fetchServiceOrders();
  }, []);

  return {
    serviceOrders,
    setServiceOrders,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    selectedServiceOrder,
    setSelectedServiceOrder,
    loading,
    handleViewServiceOrder,
    handleCreateServiceOrder,
    handleUpdateStatus,
    fetchServiceOrders
  };
};
