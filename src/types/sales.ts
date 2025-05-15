
import { PaymentMethodType } from './common';

export interface Sale {
  id: string;
  customerName: string;
  customerId?: number;
  date: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  status: SaleStatusType;
  invoiceNumber?: string;
  notes?: string;
}

export interface SaleItem {
  id: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type SaleStatusType = 'Concluída' | 'Cancelada' | 'Pendente';
