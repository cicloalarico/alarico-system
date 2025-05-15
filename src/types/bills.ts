
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
