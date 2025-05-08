
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Appointment } from "@/types";
import { CalendarClock, User, ClipboardList, Info } from "lucide-react";

interface AppointmentDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onEdit: () => void;
  onDelete: () => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  isOpen,
  onClose,
  appointment,
  onEdit,
  onDelete,
}) => {
  if (!appointment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Agendado":
        return "bg-blue-500";
      case "Confirmado":
        return "bg-orange-500";
      case "Em andamento":
        return "bg-purple-500";
      case "Concluído":
        return "bg-green-500";
      case "Cancelado":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'às' HH:mm", {
      locale: ptBR,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span
              className={`inline-block w-4 h-4 rounded-full ${getStatusColor(
                appointment.status
              )}`}
            ></span>
            <span>{appointment.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Status:</span>
            <Badge
              style={{ backgroundColor: appointment.color }}
              className="text-white"
            >
              {appointment.status}
            </Badge>
          </div>

          <Separator />

          {/* Detalhes do agendamento */}
          <div className="space-y-4">
            {/* Data e hora */}
            <div className="flex items-start">
              <CalendarClock className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <p className="font-medium">Data e hora</p>
                <p className="text-sm">
                  Início: {formatDateTime(appointment.start)}
                </p>
                <p className="text-sm">
                  Fim: {formatDateTime(appointment.end)}
                </p>
              </div>
            </div>

            {/* Cliente */}
            <div className="flex items-start">
              <User className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <p className="font-medium">Cliente</p>
                <p className="text-sm">{appointment.customerName}</p>
              </div>
            </div>

            {/* Técnico responsável */}
            {appointment.technicianName && (
              <div className="flex items-start">
                <User className="h-5 w-5 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Técnico responsável</p>
                  <p className="text-sm">{appointment.technicianName}</p>
                </div>
              </div>
            )}

            {/* Ordem de serviço */}
            {appointment.serviceOrderId && (
              <div className="flex items-start">
                <ClipboardList className="h-5 w-5 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Ordem de Serviço</p>
                  <p className="text-sm">{appointment.serviceOrderId}</p>
                </div>
              </div>
            )}

            {/* Descrição */}
            {appointment.description && (
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Descrição</p>
                  <p className="text-sm">{appointment.description}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onDelete} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
              Excluir
            </Button>
            <Button onClick={onEdit}>Editar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetails;
