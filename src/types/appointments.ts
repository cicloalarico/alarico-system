
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
