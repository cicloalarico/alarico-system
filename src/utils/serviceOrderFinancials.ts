
import { ServiceOrder } from '@/types';
import { FinancialTransaction } from '@/types/financial';
import { PaymentMethodType, TransactionStatusType } from '@/types/common';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, addMonths } from 'date-fns';

/**
 * Generates financial transactions based on a service order
 */
export const generateFinancialTransactions = async (
  order: ServiceOrder, 
  toast: ReturnType<typeof useToast>
): Promise<FinancialTransaction[]> => {
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
    toast.toast({
      title: "Erro",
      description: `Falha ao gerar transações financeiras: ${err.message}`,
      variant: "destructive",
    });
    throw err;
  }
};
