export type PriorityType = 'Baixa' | 'Normal' | 'Alta' | 'Urgente';
export type ServiceStatusType = 'Aberta' | 'Em andamento' | 'Aguardando peças' | 'Concluída' | 'Entregue' | 'Cancelada' | 'Aguardando';
export type PaymentMethodType = 'Dinheiro' | 'PIX' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Crediário Loja';

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
  minSellPrice: number;
  profitMargin: number;
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

// Add DateRange type for the Reports page
export interface DateRange {
  from: Date;
  to: Date | undefined;
}

// Novos tipos para Vendas (Sales)
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

export type PaymentMethodType = 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'PIX' | 'Transferência' | 'Boleto';
export type SaleStatusType = 'Concluída' | 'Cancelada' | 'Pendente';

// Novos tipos para Financeiro (Financial)
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
  relatedId?: string; // ID relacionado a uma venda ou ordem de serviço
  notes?: string;
}

export interface CashFlow {
  date: string;
  initialBalance: number;
  inflow: number;
  outflow: number;
  finalBalance: number;
}

// Novos tipos para Agenda (Calendar)
export interface Appointment {
  id: string;
  title: string;
  customerId?: number;
  customerName: string;
  start: string;
  end: string;
  description?: string;
  serviceOrderId?: string;
  technicianId?: number;
  technicianName?: string;
  status: AppointmentStatusType;
  color?: string;
}

export type AppointmentStatusType = 'Agendado' | 'Confirmado' | 'Em andamento' | 'Concluído' | 'Cancelado';

// Tipos para Contas a Pagar
export type BillStatusType = 'pendente' | 'pago' | 'atrasado' | 'cancelado';
export type BillCategoryType = 'fornecedor' | 'utilidades' | 'funcionário' | 'aluguel' | 'impostos' | 'marketing' | 'outros';
export type BillFrequencyType = 'único' | 'mensal' | 'trimestral' | 'semestral' | 'anual';

export interface Bill {
  id: string;
  description: string;
  category: BillCategoryType;
  amount: number;
  dueDate: string;
  status: BillStatusType;
  paymentDate?: string;
  frequency: BillFrequencyType;
  supplier?: string;
  notes?: string;
  document?: string;
  isRecurring: boolean;
  parentBillId?: string;
}

export interface EmployeeSalary extends Bill {
  employeeId: string;
  employeeName: string;
  baseSalary: number;
  commission: number;
  salesTarget: number;
  advances: EmployeeAdvance[];
  totalAdvances: number;
  netSalary: number;
}

export interface EmployeeAdvance {
  id: string;
  date: string;
  amount: number;
  description: string;
}

export interface PaymentInstallment {
  id: string;
  transactionId: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  status: 'pago' | 'pendente' | 'atrasado' | 'cancelado';
  paymentDate?: string;
}
