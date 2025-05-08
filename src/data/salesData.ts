
import { Sale, PaymentMethodType, SaleStatusType, SaleItem } from "@/types";

// Dados de exemplo para vendas
export const salesData: Sale[] = [
  {
    id: "V2024001",
    customerName: "João Silva",
    customerId: 1,
    date: "2024-05-01",
    items: [
      {
        id: "1",
        productId: 1,
        productName: "Pneu MTB 29\"",
        quantity: 2,
        unitPrice: 129.90,
        subtotal: 259.80
      },
      {
        id: "2",
        productId: 2,
        productName: "Câmara aro 29",
        quantity: 2,
        unitPrice: 29.90,
        subtotal: 59.80
      }
    ],
    totalAmount: 319.60,
    paymentMethod: "Cartão de Crédito",
    status: "Concluída",
    invoiceNumber: "NF-e 001234",
    notes: "Cliente frequente"
  },
  {
    id: "V2024002",
    customerName: "Maria Oliveira",
    customerId: 2,
    date: "2024-05-02",
    items: [
      {
        id: "1",
        productId: 5,
        productName: "Lubrificante de corrente",
        quantity: 1,
        unitPrice: 39.90,
        subtotal: 39.90
      }
    ],
    totalAmount: 39.90,
    paymentMethod: "PIX",
    status: "Concluída",
    invoiceNumber: "NF-e 001235",
    notes: ""
  },
  {
    id: "V2024003",
    customerName: "Roberto Almeida",
    customerId: 3,
    date: "2024-05-03",
    items: [
      {
        id: "1",
        productId: 3,
        productName: "Pastilha de freio Shimano",
        quantity: 1,
        unitPrice: 89.90,
        subtotal: 89.90
      },
      {
        id: "2",
        productId: 4,
        productName: "Óleo suspensão 10w",
        quantity: 1,
        unitPrice: 120.00,
        subtotal: 120.00
      }
    ],
    totalAmount: 209.90,
    paymentMethod: "Dinheiro",
    status: "Concluída",
    invoiceNumber: "NF-e 001236",
    notes: ""
  },
  {
    id: "V2024004",
    customerName: "Ana Ferreira",
    customerId: 4,
    date: "2024-05-06",
    items: [
      {
        id: "1",
        productId: 1,
        productName: "Pneu MTB 29\"",
        quantity: 1,
        unitPrice: 129.90,
        subtotal: 129.90
      }
    ],
    totalAmount: 129.90,
    paymentMethod: "Cartão de Débito",
    status: "Pendente",
    notes: "Aguardando retirada"
  }
];

// Opções de método de pagamento
export const paymentMethodOptions = [
  { value: "Dinheiro", label: "Dinheiro" },
  { value: "Cartão de Crédito", label: "Cartão de Crédito" },
  { value: "Cartão de Débito", label: "Cartão de Débito" },
  { value: "PIX", label: "PIX" },
  { value: "Transferência", label: "Transferência" },
  { value: "Boleto", label: "Boleto" },
];

// Opções de status de venda
export const saleStatusOptions = [
  { value: "Concluída", label: "Concluída" },
  { value: "Cancelada", label: "Cancelada" },
  { value: "Pendente", label: "Pendente" },
];
