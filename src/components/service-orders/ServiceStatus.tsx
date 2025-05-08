
import React from "react";
import { Badge } from "@/components/ui/badge";

export type ServiceStatusType = "Aberta" | "Em andamento" | "Aguardando peças" | "Concluída" | "Entregue" | "Cancelada";

interface ServiceStatusProps {
  status: ServiceStatusType;
}

const statusColors: Record<ServiceStatusType, string> = {
  "Aberta": "bg-blue-100 text-blue-800",
  "Em andamento": "bg-amber-100 text-amber-800",
  "Aguardando peças": "bg-purple-100 text-purple-800",
  "Concluída": "bg-green-100 text-green-800",
  "Entregue": "bg-gray-100 text-gray-800",
  "Cancelada": "bg-red-100 text-red-800",
};

const ServiceStatus: React.FC<ServiceStatusProps> = ({ status }) => {
  return (
    <Badge className={statusColors[status]}>
      {status}
    </Badge>
  );
};

export default ServiceStatus;
