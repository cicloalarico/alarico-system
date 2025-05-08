
import { ServiceOrder, PriorityType, ServiceStatusType } from "@/types";
import { Product } from "@/types";

// Mock data for service orders
export const initialServiceOrders: ServiceOrder[] = [
  {
    id: "OS2024001",
    customer: "João Silva",
    bikeModel: "Mountain Bike Trek X-Caliber 8",
    issueDescription: "Freios fazendo barulho e sem força",
    status: "Em andamento",
    priority: "Normal",
    createdAt: "2024-05-01",
    scheduledFor: "2024-05-05",
    completedAt: null,
    technician: "Carlos Oliveira",
    services: [
      { id: "1", name: "Regulagem de freios", price: 60.00 }
    ],
    products: [
      { id: "1", name: "Pastilha de freio Shimano", quantity: 2, price: 89.90, subtotal: 179.80 }
    ],
    totalPrice: 239.80,
    notes: "Cliente solicitou revisão dos câmbios também."
  },
  {
    id: "OS2024002",
    customer: "Maria Oliveira",
    bikeModel: "Caloi Elite Carbon",
    issueDescription: "Revisão geral para viagem",
    status: "Concluída",
    priority: "Alta",
    createdAt: "2024-05-02",
    scheduledFor: "2024-05-04",
    completedAt: "2024-05-04",
    technician: "Carlos Oliveira",
    services: [
      { id: "1", name: "Revisão completa", price: 180.00 },
      { id: "2", name: "Troca de óleo de suspensão", price: 150.00 }
    ],
    products: [
      { id: "1", name: "Óleo suspensão 10w", quantity: 1, price: 120.00, subtotal: 120.00 },
      { id: "2", name: "Lubrificante de corrente", quantity: 1, price: 39.90, subtotal: 39.90 }
    ],
    totalPrice: 489.90,
    notes: "Fazer teste de rua após revisão."
  },
  {
    id: "OS2024003",
    customer: "Roberto Almeida",
    bikeModel: "Speed Specialized Tarmac",
    issueDescription: "Troca de grupo de câmbio",
    status: "Aguardando peças",
    priority: "Normal",
    createdAt: "2024-05-03",
    scheduledFor: "2024-05-10",
    completedAt: null,
    technician: "André Santos",
    services: [
      { id: "1", name: "Instalação grupo completo", price: 250.00 }
    ],
    products: [
      { id: "1", name: "Grupo Shimano 105", quantity: 1, price: 2500.00, subtotal: 2500.00 }
    ],
    totalPrice: 2750.00,
    notes: "Cliente vai trazer as peças."
  },
  {
    id: "OS2024004",
    customer: "Ana Ferreira",
    bikeModel: "Cannondale Trail 5",
    issueDescription: "Barulho estranho ao pedalar",
    status: "Aberta",
    priority: "Normal",
    createdAt: "2024-05-06",
    scheduledFor: "2024-05-08",
    completedAt: null,
    technician: null,
    services: [],
    products: [],
    totalPrice: 0,
    notes: "Agendar diagnóstico."
  },
  {
    id: "OS2024005",
    customer: "Carlos Santos",
    bikeModel: "BMX Mongoose Legion",
    issueDescription: "Troca de pneu e câmara",
    status: "Em andamento",
    priority: "Baixa",
    createdAt: "2024-05-05",
    scheduledFor: "2024-05-07",
    completedAt: null,
    technician: "André Santos",
    services: [
      { id: "1", name: "Troca de pneu e câmara", price: 50.00 }
    ],
    products: [
      { id: "1", name: "Pneu BMX 20\"", quantity: 1, price: 89.90, subtotal: 89.90 },
      { id: "2", name: "Câmara BMX 20\"", quantity: 1, price: 29.90, subtotal: 29.90 }
    ],
    totalPrice: 169.80,
    notes: ""
  },
];

// Priority options
export const priorityOptions = [
  { value: "Baixa", label: "Baixa" },
  { value: "Normal", label: "Normal" },
  { value: "Alta", label: "Alta" },
  { value: "Urgente", label: "Urgente" },
];

// Sample service options
export const serviceOptions = [
  { id: "1", name: "Revisão básica", price: 100.00 },
  { id: "2", name: "Revisão completa", price: 180.00 },
  { id: "3", name: "Regulagem de freios", price: 60.00 },
  { id: "4", name: "Regulagem de câmbio", price: 70.00 },
  { id: "5", name: "Troca de óleo de suspensão", price: 150.00 },
  { id: "6", name: "Alinhamento de rodas", price: 80.00 },
  { id: "7", name: "Troca de pneu e câmara", price: 50.00 },
  { id: "8", name: "Instalação grupo completo", price: 250.00 },
];

// Define o tipo para produtos na ordem de serviço
// Fixed - Using Pick and adding the necessary properties instead of extending
export interface ServiceOrderProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock?: number;
  subtotal?: number;
  code?: string;
  category?: string;
  brand?: string;
  costPrice?: number;
  sellPrice?: number;
  minStock?: number;
  supplier?: string;
  location?: string;
}

// Sample product options
export const productOptions: ServiceOrderProduct[] = [
  { id: 1, name: "Pneu MTB 29\"", price: 129.90, stock: 10, quantity: 0, code: "P001", category: "Peças", brand: "Maxxis", costPrice: 90, sellPrice: 129.90, minStock: 5, supplier: "BikeImport" },
  { id: 2, name: "Câmara aro 29", price: 29.90, stock: 15, quantity: 0, code: "P002", category: "Peças", brand: "CST", costPrice: 15, sellPrice: 29.90, minStock: 10, supplier: "BikeImport" },
  { id: 3, name: "Pastilha de freio Shimano", price: 89.90, stock: 8, quantity: 0, code: "P003", category: "Peças", brand: "Shimano", costPrice: 60, sellPrice: 89.90, minStock: 4, supplier: "Shimano BR" },
  { id: 4, name: "Óleo suspensão 10w", price: 120.00, stock: 5, quantity: 0, code: "P004", category: "Lubrificantes", brand: "RockShox", costPrice: 80, sellPrice: 120.00, minStock: 2, supplier: "BikeImport" },
  { id: 5, name: "Lubrificante de corrente", price: 39.90, stock: 20, quantity: 0, code: "P005", category: "Lubrificantes", brand: "Finish Line", costPrice: 25, sellPrice: 39.90, minStock: 5, supplier: "BikeImport" },
];

// Sample customers
export const customerOptions = [
  { id: 1, name: "João Silva" },
  { id: 2, name: "Maria Oliveira" },
  { id: 3, name: "Roberto Almeida" },
  { id: 4, name: "Ana Ferreira" },
  { id: 5, name: "Carlos Santos" },
];

// Sample technicians
export const technicianOptions = [
  { id: 1, name: "Carlos Oliveira" },
  { id: 2, name: "André Santos" },
  { id: 3, name: "Fernanda Lima" },
];
