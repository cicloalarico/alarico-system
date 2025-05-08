
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  quantity: number; // Changed from optional to required to match ServiceOrderForm.tsx
}

export interface Customer {
  id: number;
  name: string;
  cpf?: string;
  email?: string;
  phone?: string;
}

export interface ServiceOrder {
  id: string;
  customer: string;
  bikeModel: string;
  issueDescription: string;
  status: "Aberta" | "Em andamento" | "Aguardando peças" | "Concluída" | "Entregue" | "Cancelada";
  priority: "Baixa" | "Normal" | "Alta" | "Urgente";
  createdAt: string;
  scheduledFor: string;
  completedAt: string | null;
  technician: string | null;
  services: Array<{
    id: number;
    name: string;
    price: number;
  }>;
  products: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  totalPrice: number;
  notes: string;
}

export interface DateRange {
  from: Date;
  to: Date; // Changed from optional to required to match usage
}
