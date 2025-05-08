
import React from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bike, Calendar, Clock, User } from "lucide-react";
import ServiceStatus, { ServiceStatusType } from "./ServiceStatus";

interface ServiceOrderCardProps {
  order: {
    id: string;
    customer: string;
    bikeModel: string;
    issueDescription: string;
    status: ServiceStatusType;
    priority: "Baixa" | "Normal" | "Alta" | "Urgente";
    createdAt: string;
    scheduledFor: string;
    technician: string | null;
    totalPrice: number;
  };
  onViewDetails: (order: any) => void;
}

const ServiceOrderCard: React.FC<ServiceOrderCardProps> = ({ order, onViewDetails }) => {
  return (
    <Card key={order.id} className="overflow-hidden">
      <CardHeader className="bg-gray-50 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {order.id}
              {order.priority === "Alta" && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                  Prioridade Alta
                </span>
              )}
              {order.priority === "Urgente" && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                  URGENTE
                </span>
              )}
            </CardTitle>
            <CardDescription>{order.customer}</CardDescription>
          </div>
          <ServiceStatus status={order.status} />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Bike className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-700">{order.bikeModel}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-700">Agendado para: {order.scheduledFor}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-700">Aberto em: {order.createdAt}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-700">
              <span className="font-medium">Problema relatado:</span> {order.issueDescription}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center text-sm">
                {order.status === "Em andamento" && (
                  <div className="flex items-center text-amber-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Em andamento</span>
                  </div>
                )}
                {order.status === "Concluída" && (
                  <div className="flex items-center text-green-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Concluído</span>
                  </div>
                )}
              </div>
              <div className="font-semibold">
                R$ {order.totalPrice.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 flex justify-between">
        <div className="text-sm text-gray-500">
          {order.technician ? `Técnico: ${order.technician}` : "Técnico não definido"}
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-primary flex items-center"
          onClick={() => onViewDetails(order)}
        >
          Detalhes
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceOrderCard;
