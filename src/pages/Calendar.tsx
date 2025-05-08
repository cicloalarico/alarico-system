import React, { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock, User, Bike, Wrench, MoreHorizontal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock de técnicos
const technicians = [
  { id: 1, name: "Carlos Oliveira", color: "#4ADE80" },
  { id: 2, name: "André Santos", color: "#FB923C" },
  { id: 3, name: "Fernanda Lima", color: "#60A5FA" },
];

// Mock de tipos de eventos
const eventTypes = [
  { id: "service", label: "Serviço", color: "bg-blue-100 text-blue-800" },
  { id: "delivery", label: "Entrega", color: "bg-green-100 text-green-800" },
  { id: "meeting", label: "Reunião", color: "bg-purple-100 text-purple-800" },
  { id: "other", label: "Outro", color: "bg-gray-100 text-gray-800" },
];

// Mock de eventos iniciais
const initialEvents = [
  {
    id: 1,
    title: "Revisão Mountain Bike Trek",
    date: "2024-05-08",
    startTime: "09:00",
    endTime: "10:30",
    type: "service",
    customer: "João Silva",
    description: "Revisão completa da suspensão e freios",
    technicianId: 1,
    status: "scheduled",
  },
  {
    id: 2,
    title: "Entrega Bicicleta Caloi Elite",
    date: "2024-05-08",
    startTime: "14:00",
    endTime: "14:30",
    type: "delivery",
    customer: "Maria Oliveira",
    description: "Entrega de bicicleta nova",
    technicianId: 2,
    status: "scheduled",
  },
  {
    id: 3,
    title: "Troca de Grupo Shimano",
    date: "2024-05-09",
    startTime: "10:00",
    endTime: "13:00",
    type: "service",
    customer: "Roberto Almeida",
    description: "Instalação completa do grupo Shimano 105",
    technicianId: 1,
    status: "scheduled",
  },
  {
    id: 4,
    title: "Reunião com Fornecedores",
    date: "2024-05-10",
    startTime: "15:00",
    endTime: "16:30",
    type: "meeting",
    description: "Reunião para discutir novos produtos",
    status: "scheduled",
  },
  {
    id: 5,
    title: "Regulagem de Freios",
    date: "2024-05-12",
    startTime: "11:00",
    endTime: "12:00",
    type: "service",
    customer: "Ana Ferreira",
    description: "Regulagem dos freios a disco",
    technicianId: 3,
    status: "scheduled",
  },
];

// Formatador de horas
const formatTime = (timeString: string) => {
  return timeString.replace(":00", "h");
};

const Calendar = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState(initialEvents);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [viewMode, setViewMode] = useState("day");
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isViewEventOpen, setIsViewEventOpen] = useState(false);
  
  // Estado para novo evento
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "10:00",
    type: "service",
    customer: "",
    description: "",
    technicianId: 0,
    status: "scheduled",
  });

  // Filtra eventos pela data selecionada
  const filteredEvents = events.filter(event => {
    if (!selectedDate) return false;
    return event.date === format(selectedDate, "yyyy-MM-dd");
  });

  // Manipula a criação de um novo evento
  const handleCreateEvent = () => {
    if (!newEvent.title) {
      toast({
        title: "Erro",
        description: "O título do evento é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const id = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
    const eventToAdd = { ...newEvent, id };
    
    setEvents([...events, eventToAdd]);
    setIsAddEventOpen(false);
    
    toast({
      title: "Evento criado",
      description: `${newEvent.title} agendado para ${format(new Date(newEvent.date), "dd/MM/yyyy")}`,
    });
    
    // Reset form
    setNewEvent({
      title: "",
      date: format(selectedDate || new Date(), "yyyy-MM-dd"),
      startTime: "09:00",
      endTime: "10:00",
      type: "service",
      customer: "",
      description: "",
      technicianId: 0,
      status: "scheduled",
    });
  };

  // Manipula a visualização de um evento
  const handleViewEvent = (event: any) => {
    setSelectedEvent(event);
    setIsViewEventOpen(true);
  };

  // Obter cor do técnico pelo ID
  const getTechnicianColor = (techId: number) => {
    const tech = technicians.find(t => t.id === techId);
    return tech ? tech.color : "#CBD5E1";
  };

  // Obter classe de cor pelo tipo de evento
  const getEventTypeColor = (type: string) => {
    const eventType = eventTypes.find(t => t.id === type);
    return eventType ? eventType.color : "bg-gray-100 text-gray-800";
  };

  // Navegar para o dia anterior
  const goToPreviousDay = () => {
    if (selectedDate) {
      const previousDay = new Date(selectedDate);
      previousDay.setDate(previousDay.getDate() - 1);
      setSelectedDate(previousDay);
    }
  };

  // Navegar para o dia seguinte
  const goToNextDay = () => {
    if (selectedDate) {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setSelectedDate(nextDay);
    }
  };

  // Navegar para hoje
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Agenda</h1>
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus size={16} /> Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Novo Agendamento</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título*</Label>
                <Input 
                  id="title" 
                  value={newEvent.title} 
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select 
                    value={newEvent.type}
                    onValueChange={(value) => setNewEvent({...newEvent, type: value})}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Hora Início</Label>
                  <Input 
                    id="startTime" 
                    type="time" 
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Hora Fim</Label>
                  <Input 
                    id="endTime" 
                    type="time" 
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                  />
                </div>
              </div>
              
              {newEvent.type === "service" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="customer">Cliente</Label>
                    <Input 
                      id="customer" 
                      value={newEvent.customer || ""}
                      onChange={(e) => setNewEvent({...newEvent, customer: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="technician">Técnico Responsável</Label>
                    <Select 
                      value={newEvent.technicianId ? String(newEvent.technicianId) : ""}
                      onValueChange={(value) => setNewEvent({...newEvent, technicianId: parseInt(value)})}
                    >
                      <SelectTrigger id="technician">
                        <SelectValue placeholder="Selecione o técnico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhum</SelectItem>
                        {technicians.map((tech) => (
                          <SelectItem key={tech.id} value={String(tech.id)}>
                            {tech.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  value={newEvent.description || ""}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreateEvent}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendário */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              locale={ptBR}
            />
            <div className="mt-4 space-y-4">
              <h3 className="font-medium">Técnicos</h3>
              <div className="space-y-2">
                {technicians.map(tech => (
                  <div key={tech.id} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{backgroundColor: tech.color}}
                    ></div>
                    <span className="text-sm">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualização do dia */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>
                {selectedDate && (
                  format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })
                )}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Hoje
                </Button>
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" onClick={goToPreviousDay}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={goToNextDay}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
                  <TabsList className="h-8">
                    <TabsTrigger value="day" className="h-7 px-3">Dia</TabsTrigger>
                    <TabsTrigger value="list" className="h-7 px-3">Lista</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="day" className="mt-0">
              <div className="relative grid grid-cols-1 min-h-[500px]">
                {/* Horas do dia */}
                <div className="absolute inset-0 grid grid-rows-12 pointer-events-none">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="border-t border-gray-100 pt-1 text-xs text-gray-400">
                      {i + 8}:00
                    </div>
                  ))}
                </div>
                
                {/* Eventos do dia */}
                <div className="relative h-full">
                  {filteredEvents.map((event) => {
                    // Cálculo de posição e altura dos eventos
                    const startHour = parseInt(event.startTime.split(":")[0]);
                    const startMinute = parseInt(event.startTime.split(":")[1]);
                    const endHour = parseInt(event.endTime.split(":")[0]);
                    const endMinute = parseInt(event.endTime.split(":")[1]);
                    
                    const startPosition = ((startHour - 8) + startMinute / 60) * (100 / 12);
                    const duration = (endHour - startHour) + (endMinute - startMinute) / 60;
                    const height = duration * (100 / 12);
                    
                    return (
                      <div 
                        key={event.id} 
                        className="absolute left-12 right-0 rounded-md px-3 py-1 shadow-sm border-l-4 overflow-hidden cursor-pointer"
                        style={{
                          top: `${startPosition}%`,
                          height: `${height}%`,
                          borderLeftColor: event.technicianId ? getTechnicianColor(event.technicianId) : '#CBD5E1',
                          backgroundColor: event.type === 'service' ? '#EFF6FF' : 
                                          event.type === 'delivery' ? '#ECFDF5' : 
                                          event.type === 'meeting' ? '#F3E8FF' : '#F1F5F9'
                        }}
                        onClick={() => handleViewEvent(event)}
                      >
                        <div className="font-medium text-sm truncate">{event.title}</div>
                        <div className="text-xs flex items-center gap-1 text-gray-600">
                          <Clock size={12} />
                          <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                        </div>
                        {event.customer && (
                          <div className="text-xs flex items-center gap-1 text-gray-600 truncate">
                            <User size={12} />
                            <span>{event.customer}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {filteredEvents.length === 0 && (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Nenhum agendamento para este dia
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="list" className="mt-0">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Nenhum agendamento para este dia
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredEvents
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((event) => (
                      <div 
                        key={event.id} 
                        className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleViewEvent(event)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h4 className="font-medium">{event.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                              </div>
                              {event.customer && (
                                <div className="flex items-center gap-1">
                                  <User size={14} />
                                  <span>{event.customer}</span>
                                </div>
                              )}
                              {event.technicianId > 0 && (
                                <div className="flex items-center gap-1">
                                  <Wrench size={14} />
                                  <span>
                                    {technicians.find(t => t.id === event.technicianId)?.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge className={getEventTypeColor(event.type)}>
                            {eventTypes.find(t => t.id === event.type)?.label}
                          </Badge>
                        </div>
                      </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para visualizar evento */}
      <Dialog open={isViewEventOpen} onOpenChange={setIsViewEventOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Detalhes do Agendamento</span>
              <Badge className={getEventTypeColor(selectedEvent?.type || 'other')}>
                {eventTypes.find(t => t.id === selectedEvent?.type)?.label || "Outro"}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">{selectedEvent.title}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Data</p>
                  <p>
                    {format(new Date(selectedEvent.date), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Horário</p>
                  <p>
                    {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                  </p>
                </div>
              </div>
              
              {selectedEvent.customer && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Cliente</p>
                  <p>{selectedEvent.customer}</p>
                </div>
              )}
              
              {selectedEvent.technicianId > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Técnico Responsável</p>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{backgroundColor: getTechnicianColor(selectedEvent.technicianId)}}
                    ></div>
                    <p>{technicians.find(t => t.id === selectedEvent.technicianId)?.name}</p>
                  </div>
                </div>
              )}
              
              {selectedEvent.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Descrição</p>
                  <p className="text-sm">{selectedEvent.description}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewEventOpen(false)}>
              Fechar
            </Button>
            {selectedEvent?.type === 'service' && (
              <Button className="flex items-center gap-2">
                <Bike className="h-4 w-4" />
                Ver Ordem de Serviço
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
