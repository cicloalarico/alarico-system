
export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  paymentMethod: PaymentMethodType;
  status: TransactionStatusType;
  dueDate?: string;
  relatedId?: string;
  notes?: string;
}

export type TransactionType = "receita" | "despesa";
export type TransactionStatusType = "pendente" | "pago" | "cancelado" | "atrasado";
