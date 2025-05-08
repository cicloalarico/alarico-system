
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

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  password: string;
  department?: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  confirmPassword?: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address: string;
  notes: string;
}

export interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  brand: string;
  costPrice: number;
  sellPrice: number;
  stock: number;
  minStock: number;
  supplier: string;
  location?: string;
  lastUpdated?: string;
  price?: number;
  quantity?: number;
}

export interface StockMovement {
  id: number;
  productId: number;
  date: string;
  time: string;
  type: "entrada" | "saída";
  quantity: number;
  reason: string;
  document: string;
  user: string;
}
