
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ServiceOrder, ServiceStatusType, PriorityType, FinancialTransaction, PaymentInstallment, PaymentMethodType } from '@/types';
import { technicianOptions, initialServiceOrders } from '@/data/serviceOrdersData';
import { format, addMonths } from 'date-fns';

export const useServiceOrders = () => {
  const { toast } = useToast();
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(initialServiceOrders);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedServiceOrder, setSelectedServiceOrder] = useState<ServiceOrder | null>(null);

  // Manipular visualização de uma ordem de serviço
  const handleViewServiceOrder = (order: ServiceOrder) => {
    setSelectedServiceOrder(order);
    setIsViewDialogOpen(true);
  };

  // Gerar transações financeiras baseadas em uma ordem de serviço
  const generateFinancialTransactions = (order: ServiceOrder): FinancialTransaction[] => {
    const transactions: FinancialTransaction[] = [];
    
    // Se for à vista (dinheiro ou PIX), cria uma única transação
    if (order.paymentMethod === "Dinheiro" || order.paymentMethod === "PIX") {
      transactions.push({
        id: `F${new Date().getFullYear()}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
        date: order.createdAt,
        description: `Pagamento OS ${order.id} - ${order.customer}`,
        category: "serviços",
        amount: order.totalPrice,
        type: "receita",
        paymentMethod: order.paymentMethod,
        status: "pago",
        relatedId: order.id,
        notes: `Pagamento à vista - OS ${order.id}`
      });
    }
    // Se for cartão, cria uma única transação pendente
    else if (order.paymentMethod === "Cartão de Crédito" || order.paymentMethod === "Cartão de Débito") {
      transactions.push({
        id: `F${new Date().getFullYear()}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
        date: order.createdAt,
        description: `Pagamento OS ${order.id} - ${order.customer}`,
        category: "serviços",
        amount: order.totalPrice,
        type: "receita",
        paymentMethod: order.paymentMethod,
        status: "pendente",
        dueDate: format(new Date(order.createdAt), 'yyyy-MM-dd'),
        relatedId: order.id,
        notes: `Pagamento com cartão - OS ${order.id}`
      });
    }
    // Se for crediário, cria transações para entrada e parcelas
    else if (order.paymentMethod === "Crediário Loja" && order.firstInstallmentDate) {
      // Transação para entrada se houver
      if (order.downPayment && order.downPayment > 0) {
        transactions.push({
          id: `F${new Date().getFullYear()}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
          date: order.createdAt,
          description: `Entrada OS ${order.id} - ${order.customer}`,
          category: "serviços",
          amount: order.downPayment,
          type: "receita",
          paymentMethod: "Dinheiro",
          status: "pago",
          relatedId: order.id,
          notes: `Entrada do crediário - OS ${order.id}`
        });
      }
      
      // Transações para parcelas
      if (order.installments && order.installmentAmount) {
        const firstDate = new Date(order.firstInstallmentDate);
        
        for (let i = 0; i < order.installments; i++) {
          const dueDate = format(addMonths(firstDate, i), 'yyyy-MM-dd');
          
          transactions.push({
            id: `F${new Date().getFullYear()}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}-P${i+1}`,
            date: order.createdAt,
            description: `Parcela ${i+1}/${order.installments} - OS ${order.id} - ${order.customer}`,
            category: "serviços",
            amount: order.installmentAmount,
            type: "receita",
            paymentMethod: "Crediário Loja",
            status: "pendente",
            dueDate: dueDate,
            relatedId: order.id,
            notes: `Parcela ${i+1} de ${order.installments} - OS ${order.id}`
          });
        }
      }
    }
    
    return transactions;
  };

  // Manipular criação de uma nova ordem de serviço
  const handleCreateServiceOrder = (data: any) => {
    const orderCount = serviceOrders.length;
    
    // Ensure the priority is valid by checking against allowed values
    const validPriorities: PriorityType[] = ["Baixa", "Normal", "Alta", "Urgente"];
    const priority: PriorityType = validPriorities.includes(data.priority as PriorityType) 
      ? (data.priority as PriorityType) 
      : "Normal";
    
    const newOrder: ServiceOrder = {
      id: `OS2024${String(orderCount + 1).padStart(3, "0")}`,
      customer: data.customer,
      bikeModel: data.bikeModel,
      issueDescription: data.issueDescription,
      status: "Aberta",
      priority,
      createdAt: new Date().toISOString().split("T")[0],
      scheduledFor: data.scheduledFor,
      completedAt: null,
      technician: data.technicianId ? technicianOptions.find(t => t.id === parseInt(data.technicianId))?.name || null : null,
      services: data.services ? data.services.map((s: any) => ({ ...s, id: String(s.id) })) : [],
      products: data.products,
      totalPrice: data.totalPrice,
      notes: data.notes,
      laborValue: data.laborValue || 0,
      paymentMethod: data.paymentMethod as PaymentMethodType,
      downPayment: data.downPayment,
      installments: data.installments,
      installmentAmount: data.installmentAmount,
      firstInstallmentDate: data.firstInstallmentDate,
    };

    setServiceOrders([...serviceOrders, newOrder]);
    setIsAddDialogOpen(false);
    
    // Gerar as transações financeiras
    const transactions = generateFinancialTransactions(newOrder);

    // Aqui você precisaria integrar com a tela de Financeiro para adicionar as transações
    // Como não estamos modificando a tela de Financeiro neste momento, apenas logamos no console
    console.log("Transações financeiras geradas:", transactions);
    
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
  };

  // Atualizar status da ordem de serviço
  const handleUpdateStatus = (orderId: string, newStatus: ServiceStatusType) => {
    const updatedOrders = serviceOrders.map(order => {
      if (order.id === orderId) {
        // Create a new object to avoid mutating the original
        const updatedOrder = { ...order, status: newStatus };
        if (newStatus === "Concluída" || newStatus === "Entregue") {
          updatedOrder.completedAt = new Date().toISOString().split("T")[0];
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
  };

  return {
    serviceOrders,
    setServiceOrders,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    selectedServiceOrder,
    setSelectedServiceOrder,
    handleViewServiceOrder,
    handleCreateServiceOrder,
    handleUpdateStatus
  };
};
