
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

// Interface para criar uma venda no banco de dados
export interface SaleCreate {
  id?: string; // ID será gerado pelo banco se não fornecido
  customer_id?: number;
  date: string;
  total_amount: number;
  payment_method: PaymentMethodType;
  status: SaleStatusType;
  invoice_number?: string;
  notes?: string;
}

// Interface para criar um item de venda no banco de dados
export interface SaleItemCreate {
  sale_id: string;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}
