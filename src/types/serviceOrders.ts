
import { PaymentMethodType } from './common';

export type PriorityType = 'Baixa' | 'Normal' | 'Alta' | 'Urgente';
export type ServiceStatusType = 'Aberta' | 'Em andamento' | 'Aguardando peças' | 'Concluída' | 'Entregue' | 'Cancelada' | 'Aguardando';

export interface ServiceOrder {
  id: string;
  customer: string;
  bikeModel: string;
  issueDescription: string;
  status: ServiceStatusType;
  priority: PriorityType;
  createdAt: string;
  scheduledFor: string;
  technician: string | null;
  totalPrice: number;
  completedAt?: string | null;
  notes?: string;
  services?: ServiceItem[];
  products?: ProductItem[];
  laborValue?: number; 
  paymentMethod?: PaymentMethodType;
  downPayment?: number;
  installments?: number;
  installmentAmount?: number;
  firstInstallmentDate?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal?: number;
}
