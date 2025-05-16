
import { PaymentMethodType, TransactionStatusType } from "./common";

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

// Adding the interface CashFlow
export interface CashFlow {
  date: string;
  initialBalance: number;
  inflow: number;
  outflow: number;
  finalBalance: number;
}
