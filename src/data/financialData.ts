import { FinancialTransaction, CashFlow } from "@/types/financial";

// Dados de exemplo para transações financeiras
export const financialTransactionsData: FinancialTransaction[] = [
  {
    id: "F2024001",
    date: "2024-05-01",
    description: "Venda #V2024001",
    category: "Vendas",
    amount: 319.60,
    type: "receita",
    paymentMethod: "Cartão de Crédito",
    status: "pago",
    relatedId: "V2024001",
    notes: ""
  },
  {
    id: "F2024002",
    date: "2024-05-02",
    description: "Venda #V2024002",
    category: "Vendas",
    amount: 39.90,
    type: "receita",
    paymentMethod: "PIX",
    status: "pago",
    relatedId: "V2024002",
    notes: ""
  },
  {
    id: "F2024003",
    date: "2024-05-03",
    description: "Venda #V2024003",
    category: "Vendas",
    amount: 209.90,
    type: "receita",
    paymentMethod: "Dinheiro",
    status: "pago",
    relatedId: "V2024003",
    notes: ""
  },
  {
    id: "F2024004",
    date: "2024-05-01",
    description: "Pagamento de aluguel",
    category: "Aluguel",
    amount: 1200.00,
    type: "despesa",
    paymentMethod: "Transferência",
    status: "pago",
    notes: "Pagamento mensal"
  },
  {
    id: "F2024005",
    date: "2024-05-03",
    description: "Compra de estoque",
    category: "Fornecedores",
    amount: 3500.00,
    type: "despesa",
    paymentMethod: "Boleto",
    status: "pago",
    notes: "Fornecedor: BikeImport"
  },
  {
    id: "F2024006",
    date: "2024-05-10",
    description: "Conta de energia",
    category: "Serviços públicos",
    amount: 450.00,
    type: "despesa",
    paymentMethod: "Boleto",
    status: "pendente",
    dueDate: "2024-05-15",
    notes: ""
  },
  {
    id: "F2024007",
    date: "2024-05-06",
    description: "Venda #V2024004",
    category: "Vendas",
    amount: 129.90,
    type: "receita",
    paymentMethod: "Cartão de Débito",
    status: "pendente",
    relatedId: "V2024004",
    notes: "Aguardando retirada"
  }
];

// Dados de exemplo para fluxo de caixa
export const cashFlowData: CashFlow[] = [
  {
    date: "2024-05-01",
    initialBalance: 5000.00,
    inflow: 319.60,
    outflow: 1200.00,
    finalBalance: 4119.60
  },
  {
    date: "2024-05-02",
    initialBalance: 4119.60,
    inflow: 39.90,
    outflow: 0,
    finalBalance: 4159.50
  },
  {
    date: "2024-05-03",
    initialBalance: 4159.50,
    inflow: 209.90,
    outflow: 3500.00,
    finalBalance: 869.40
  },
  {
    date: "2024-05-04",
    initialBalance: 869.40,
    inflow: 0,
    outflow: 0,
    finalBalance: 869.40
  },
  {
    date: "2024-05-05",
    initialBalance: 869.40,
    inflow: 0,
    outflow: 0,
    finalBalance: 869.40
  },
  {
    date: "2024-05-06",
    initialBalance: 869.40,
    inflow: 129.90,
    outflow: 0,
    finalBalance: 999.30
  }
];

// Categorias de receitas e despesas
export const categories = {
  receita: [
    { value: "Vendas", label: "Vendas" },
    { value: "Serviços", label: "Serviços" },
    { value: "Outros", label: "Outros" }
  ],
  despesa: [
    { value: "Aluguel", label: "Aluguel" },
    { value: "Fornecedores", label: "Fornecedores" },
    { value: "Salários", label: "Salários" },
    { value: "Serviços públicos", label: "Serviços públicos" },
    { value: "Impostos", label: "Impostos" },
    { value: "Outros", label: "Outros" }
  ]
};
