
import { Appointment, AppointmentStatusType } from "@/types";

// Dados de exemplo para agendamentos
export const appointmentData: Appointment[] = [
  {
    id: "A2024001",
    title: "Manutenção de Freios",
    customerId: 1,
    customerName: "João Silva",
    start: "2024-05-05T09:00:00",
    end: "2024-05-05T10:00:00",
    description: "Regulagem dos freios da Mountain Bike",
    serviceOrderId: "OS2024001",
    technicianId: 1,
    technicianName: "Carlos Oliveira",
    status: "Concluído",
    color: "#4caf50"
  },
  {
    id: "A2024002",
    title: "Revisão completa",
    customerId: 2,
    customerName: "Maria Oliveira",
    start: "2024-05-04T14:00:00",
    end: "2024-05-04T16:30:00",
    description: "Revisão geral para viagem",
    serviceOrderId: "OS2024002",
    technicianId: 1,
    technicianName: "Carlos Oliveira",
    status: "Concluído",
    color: "#4caf50"
  },
  {
    id: "A2024003",
    title: "Troca de grupo de câmbio",
    customerId: 3,
    customerName: "Roberto Almeida",
    start: "2024-05-10T10:00:00",
    end: "2024-05-10T12:00:00",
    description: "Instalação de grupo Shimano 105",
    serviceOrderId: "OS2024003",
    technicianId: 2,
    technicianName: "André Santos",
    status: "Agendado",
    color: "#2196f3"
  },
  {
    id: "A2024004",
    title: "Diagnóstico - Barulho ao pedalar",
    customerId: 4,
    customerName: "Ana Ferreira",
    start: "2024-05-08T13:00:00",
    end: "2024-05-08T14:00:00",
    description: "Verificar origem de barulho estranho ao pedalar",
    serviceOrderId: "OS2024004",
    status: "Confirmado",
    color: "#ff9800"
  },
  {
    id: "A2024005",
    title: "Troca de pneu e câmara",
    customerId: 5,
    customerName: "Carlos Santos",
    start: "2024-05-07T11:00:00",
    end: "2024-05-07T12:00:00",
    description: "Troca de pneu e câmara de BMX",
    serviceOrderId: "OS2024005",
    technicianId: 2,
    technicianName: "André Santos",
    status: "Concluído",
    color: "#4caf50"
  },
  {
    id: "A2024006",
    title: "Manutenção preventiva",
    customerId: 2,
    customerName: "Maria Oliveira",
    start: "2024-05-20T09:00:00",
    end: "2024-05-20T11:00:00",
    description: "Manutenção preventiva pré-competição",
    status: "Agendado",
    color: "#2196f3"
  }
];

// Status de agendamento
export const appointmentStatusOptions = [
  { value: "Agendado", label: "Agendado", color: "#2196f3" },
  { value: "Confirmado", label: "Confirmado", color: "#ff9800" },
  { value: "Em andamento", label: "Em andamento", color: "#9c27b0" },
  { value: "Concluído", label: "Concluído", color: "#4caf50" },
  { value: "Cancelado", label: "Cancelado", color: "#f44336" }
];

// Horários disponíveis
export const availableTimeSlots = [
  "08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];
