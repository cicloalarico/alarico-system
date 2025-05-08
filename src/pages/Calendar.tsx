
import React, { useState, useEffect } from "react";
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, addDays, isSameDay, parse, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Appointment, AppointmentStatusType } from "@/types";
import { appointmentData } from "@/data/appointmentData";
import { toast } from "@/hooks/use-toast";
import AppointmentForm from "@/components/calendar/AppointmentForm";
import AppointmentDetails from "@/components/calendar/AppointmentDetails";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [view, setView] = useState<"day" | "week">("day");

  // Filtra os compromissos baseados na visualização atual
  const getFilteredAppointments = () => {
    if (view === "day") {
      return appointments.filter((appointment) =>
        isSameDay(parseISO(appointment.start), selectedDate)
      );
    } else {
      // Visualização da semana - mostra todos os compromissos dos próximos 7 dias
      const endDate = addDays(selectedDate, 6);
      return appointments.filter((appointment) => {
        const appointmentDate = parseISO(appointment.start);
        return (
          appointmentDate >= selectedDate && appointmentDate <= endDate
        );
      });
    }
  };

  const filteredAppointments = getFilteredAppointments();

  const handleAddAppointment = (appointment: Appointment) => {
    setAppointments([...appointments, appointment]);
    setIsAddDialogOpen(false);
    toast({
      title: "Agendamento criado com sucesso",
      description: `O agendamento "${appointment.title}" foi adicionado com sucesso.`,
    });
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setAppointments(
      appointments.map((a) => (a.id === appointment.id ? appointment : a))
    );
    setIsEditDialogOpen(false);
    setIsViewDialogOpen(false);
    toast({
      title: "Agendamento atualizado com sucesso",
      description: `O agendamento "${appointment.title}" foi atualizado com sucesso.`,
    });
  };

  const handleDeleteAppointment = () => {
    if (selectedAppointment) {
      setAppointments(
        appointments.filter((a) => a.id !== selectedAppointment.id)
      );
      setIsDeleteDialogOpen(false);
      setIsViewDialogOpen(false);
      toast({
        title: "Agendamento excluído com sucesso",
        description: `O agendamento "${selectedAppointment.title}" foi excluído com sucesso.`,
      });
    }
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = () => {
    setIsViewDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = () => {
    setIsViewDialogOpen(false);
    setIsDeleteDialogOpen(true);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const getDayOfWeek = (date: Date) => {
    const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    return dayNames[date.getDay()];
  };

  // Navega para o dia/semana anterior
  const handlePrevious = () => {
    setSelectedDate(
      view === "day" ? addDays(selectedDate, -1) : addDays(selectedDate, -7)
    );
  };

  // Navega para o próximo dia/semana
  const handleNext = () => {
    setSelectedDate(
      view === "day" ? addDays(selectedDate, 1) : addDays(selectedDate, 7)
    );
  };

  // Navega para o dia atual
  const handleToday = () => {
    setSelectedDate(new Date());
  };

  // Alterna entre visualização diária e semanal
  const toggleView = () => {
    setView(view === "day" ? "week" : "day");
  };

  // Ordena os compromissos por hora de início
  const sortedAppointments = [...filteredAppointments].sort((a, b) =>
    parseISO(a.start).getTime() - parseISO(b.start).getTime()
  );

  // Obtém um resumo do dia (quantos compromissos por status)
  const getDaySummary = (date: Date) => {
    const dayAppointments = appointments.filter((appointment) =>
      isSameDay(parseISO(appointment.start), date)
    );

    const summary: Record<AppointmentStatusType, number> = {
      "Agendado": 0,
      "Confirmado": 0,
      "Em andamento": 0,
      "Concluído": 0,
      "Cancelado": 0,
    };

    dayAppointments.forEach((appointment) => {
      summary[appointment.status as AppointmentStatusType]++;
    });

    return summary;
  };

  // Renderiza os dias da semana em visualização semanal
  const renderWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(selectedDate, i);
      const summary = getDaySummary(date);
      const totalAppointments = Object.values(summary).reduce((a, b) => a + b, 0);

      days.push(
        <div key={i} className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => setSelectedDate(date)}>
          <div className="text-center mb-2">
            <div className="text-sm text-gray-500">{getDayOfWeek(date)}</div>
            <div className={`text-xl font-bold ${isSameDay(date, new Date()) ? "text-blue-600" : ""}`}>
              {format(date, "dd", { locale: ptBR })}
            </div>
            <div className="text-sm text-gray-500">{format(date, "MMM", { locale: ptBR })}</div>
          </div>
          {totalAppointments > 0 ? (
            <div className="text-center text-xs">
              <div className="flex flex-wrap justify-center gap-1 mt-2">
                {summary.Agendado > 0 && (
                  <Badge className="bg-blue-500" variant="default">{summary.Agendado}</Badge>
                )}
                {summary.Confirmado > 0 && (
                  <Badge className="bg-orange-500" variant="default">{summary.Confirmado}</Badge>
                )}
                {summary["Em andamento"] > 0 && (
                  <Badge className="bg-purple-500" variant="default">{summary["Em andamento"]}</Badge>
                )}
                {summary.Concluído > 0 && (
                  <Badge className="bg-green-500" variant="default">{summary.Concluído}</Badge>
                )}
                {summary.Cancelado > 0 && (
                  <Badge className="bg-red-500" variant="default">{summary.Cancelado}</Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-gray-400 mt-2">Sem agendamentos</div>
          )}
        </div>
      );
    }
    return days;
  };

  // Renderiza a visualização do dia selecionado
  const renderDayView = () => {
    if (sortedAppointments.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          Nenhum agendamento para este dia.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {sortedAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => handleAppointmentClick(appointment)}
            style={{ borderLeftColor: appointment.color, borderLeftWidth: "4px" }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="mr-3 text-lg font-medium">{format(parseISO(appointment.start), "HH:mm")}</div>
                <div>
                  <h3 className="font-medium">{appointment.title}</h3>
                  <p className="text-sm text-gray-500">
                    Cliente: {appointment.customerName}
                    {appointment.technicianName && ` | Técnico: ${appointment.technicianName}`}
                  </p>
                </div>
              </div>
              <Badge style={{ backgroundColor: appointment.color }} className="text-white">
                {appointment.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Agenda</h1>
          <p className="text-gray-500">Gerenciamento de horários e compromissos</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendário e controles */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                className="pointer-events-auto"
                locale={ptBR}
              />
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={handleToday}>
              Hoje
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={toggleView}
            >
              {view === "day" ? "Visualizar Semana" : "Visualizar Dia"}
            </Button>
          </div>
        </div>

        {/* Vista do dia ou semana selecionado */}
        <div className="md:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-medium">
              {view === "day" ? (
                <>
                  {getDayOfWeek(selectedDate)}, {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </>
              ) : (
                <>
                  {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })} - {format(addDays(selectedDate, 6), "dd/MM/yyyy", { locale: ptBR })}
                </>
              )}
            </h2>
          </div>

          {view === "day" ? (
            renderDayView()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
              {renderWeekDays()}
            </div>
          )}
        </div>
      </div>

      <AppointmentForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddAppointment}
        selectedDate={selectedDate}
      />

      <AppointmentForm
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEditAppointment}
        initialData={selectedAppointment || undefined}
      />

      <AppointmentDetails
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        appointment={selectedAppointment}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o agendamento "{selectedAppointment?.title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAppointment} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CalendarPage;
