import { Bill, EmployeeSalary, EmployeeAdvance, BillStatusType } from "@/types";

// Dados de exemplo para contas a pagar
export const billsData: Bill[] = [
  {
    id: "B2024001",
    description: "Aluguel da loja",
    category: "aluguel",
    amount: 2500.00,
    dueDate: "2024-05-10",
    status: "pendente",
    frequency: "mensal",
    notes: "Aluguel mensal do ponto comercial",
    isRecurring: true,
  },
  {
    id: "B2024002",
    description: "Fornecedor BikeParts",
    category: "fornecedor",
    amount: 3750.50,
    dueDate: "2024-05-15",
    status: "pendente",
    frequency: "mensal",
    supplier: "BikeParts Ltda",
    document: "NF-123456",
    notes: "Pedido de peças #PED2024010",
    isRecurring: false,
  },
  {
    id: "B2024003",
    description: "Energia elétrica",
    category: "utilidades",
    amount: 487.35,
    dueDate: "2024-05-20",
    status: "pendente",
    frequency: "mensal",
    document: "FAT-123456",
    notes: "Fatura referente ao mês anterior",
    isRecurring: true,
  },
  {
    id: "B2024004",
    description: "Internet e telefone",
    category: "utilidades",
    amount: 299.90,
    dueDate: "2024-05-18",
    status: "pendente",
    frequency: "mensal",
    supplier: "TechNet",
    document: "FAT-567890",
    notes: "Plano empresarial 500mb",
    isRecurring: true,
  },
  {
    id: "B2024005",
    description: "Sistema emissor de NF",
    category: "outros",
    amount: 89.90,
    dueDate: "2024-05-05",
    status: "pago",
    paymentDate: "2024-05-05",
    frequency: "mensal",
    supplier: "NFSystem",
    notes: "Assinatura mensal",
    isRecurring: true,
  },
  {
    id: "B2024006",
    description: "Honorários contador",
    category: "outros",
    amount: 950.00,
    dueDate: "2024-05-10",
    status: "pendente",
    frequency: "mensal",
    supplier: "Contabilidade Expert",
    notes: "Serviços de contabilidade",
    isRecurring: true,
  },
  {
    id: "B2024007",
    description: "Impostos Simples Nacional",
    category: "impostos",
    amount: 1750.80,
    dueDate: "2024-05-20",
    status: "pendente",
    frequency: "mensal",
    document: "DAS-202405",
    notes: "Imposto referente ao faturamento do mês anterior",
    isRecurring: true,
  },
];

// Dados de exemplo para adiantamentos de funcionários
const carlosAdvances: EmployeeAdvance[] = [
  {
    id: "ADV2024001",
    date: "2024-05-05",
    amount: 300.00,
    description: "Vale alimentação"
  },
  {
    id: "ADV2024002",
    date: "2024-05-15",
    amount: 500.00,
    description: "Adiantamento quinzenal"
  }
];

const mariaAdvances: EmployeeAdvance[] = [
  {
    id: "ADV2024003",
    date: "2024-05-10",
    amount: 400.00,
    description: "Adiantamento solicitado"
  }
];

// Dados de exemplo para salários de funcionários
export const employeeSalariesData: EmployeeSalary[] = [
  {
    id: "SAL2024001",
    employeeId: "E001",
    employeeName: "Carlos Silva",
    description: "Salário Carlos Silva - Maio/2024",
    category: "funcionário",
    baseSalary: 2200.00,
    commission: 350.00,
    salesTarget: 15000.00,
    advances: carlosAdvances,
    totalAdvances: 800.00,
    netSalary: 1750.00, // Base + comissão - adiantamentos
    amount: 2550.00, // Base + comissão
    dueDate: "2024-05-05",
    status: "pendente",
    frequency: "mensal",
    notes: "Mecânico principal",
    isRecurring: true,
  },
  {
    id: "SAL2024002",
    employeeId: "E002",
    employeeName: "Maria Oliveira",
    description: "Salário Maria Oliveira - Maio/2024",
    category: "funcionário",
    baseSalary: 1800.00,
    commission: 420.00,
    salesTarget: 12000.00,
    advances: mariaAdvances,
    totalAdvances: 400.00,
    netSalary: 1820.00, // Base + comissão - adiantamentos
    amount: 2220.00, // Base + comissão
    dueDate: "2024-05-05",
    status: "pendente",
    frequency: "mensal",
    notes: "Atendente de vendas",
    isRecurring: true,
  }
];

// Função para gerar uma string de status com cores diferentes para exibição
export const getBillStatusBadgeVariant = (status: BillStatusType) => {
  switch (status) {
    case "pago":
      return "success";
    case "pendente":
      return "warning";
    case "atrasado":
      return "destructive";
    case "cancelado":
      return "secondary";
    default:
      return "default";
  }
};

// Dados para as categorias de despesas
export const billCategories = [
  { value: "fornecedor", label: "Fornecedor" },
  { value: "utilidades", label: "Utilidades (Água, Luz, etc)" },
  { value: "funcionário", label: "Funcionário" },
  { value: "aluguel", label: "Aluguel" },
  { value: "impostos", label: "Impostos" },
  { value: "marketing", label: "Marketing" },
  { value: "outros", label: "Outros" }
];

// Dados para frequências de pagamento
export const billFrequencies = [
  { value: "único", label: "Pagamento Único" },
  { value: "mensal", label: "Mensal" },
  { value: "trimestral", label: "Trimestral" },
  { value: "semestral", label: "Semestral" },
  { value: "anual", label: "Anual" }
];

// Add suppliers data
export const suppliersData = [
  { id: 1, name: "BikeParts Ltda" },
  { id: 2, name: "Peças Express" },
  { id: 3, name: "Distribuidora Cycle" },
  { id: 4, name: "Importadora Biketech" },
  { id: 5, name: "Acessórios Bike & Cia" },
];
