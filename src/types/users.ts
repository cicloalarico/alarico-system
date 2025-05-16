
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
  profileId?: number;
}

export interface UserProfile {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

export interface PagePermission {
  id: number;
  profileId: number;
  pageName: string;
  canView: boolean;
  canEdit: boolean;
}

export const availablePages = [
  { id: "dashboard", name: "Dashboard" },
  { id: "customers", name: "Clientes" },
  { id: "products", name: "Produtos" },
  { id: "inventory", name: "Estoque" },
  { id: "sales", name: "Vendas" },
  { id: "serviceOrders", name: "Ordens de Serviço" },
  { id: "calendar", name: "Agenda" },
  { id: "financial", name: "Financeiro" },
  { id: "reports", name: "Relatórios" },
  { id: "bills", name: "Contas a Pagar" },
  { id: "users", name: "Usuários" },
  { id: "settings", name: "Configurações" }
];
