
import { PaymentMethodType } from './common';

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'receita' | 'despesa';
  paymentMethod: PaymentMethodType;
  status: 'pago' | 'pendente' | 'cancelado';
  dueDate?: string;
  relatedId?: string;
  notes?: string;
}

export interface CashFlow {
  date: string;
  initialBalance: number;
  inflow: number;
  outflow: number;
  finalBalance: number;
}
