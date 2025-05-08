
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarIcon, Clock } from "lucide-react";
import { Appointment } from "@/types";
import { customerOptions, technicianOptions } from "@/data/serviceOrdersData";
import { appointmentStatusOptions, availableTimeSlots } from "@/data/appointmentData";
import { format, addHours } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Título é obrigatório"),
  customerId: z.number().optional(),
  customerName: z.string().optional(),
  date: z.date(),
  startTime: z.string(),
  endTime: z.string(),
  description: z.string().optional(),
  serviceOrderId: z.string().optional(),
  technicianId: z.number().optional(),
  status: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Appointment) => void;
  initialData?: Appointment;
  selectedDate?: Date;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  selectedDate,
}) => {
  const getInitialStartTime = () => {
    if (initialData) {
      return format(new Date(initialData.start), "HH:mm");
    }
    return "09:00";
  };

  const getInitialEndTime = () => {
    if (initialData) {
      return format(new Date(initialData.end), "HH:mm");
    }
    return "10:00";
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialData?.id || "",
      title: initialData?.title || "",
      customerId: initialData?.customerId,
      customerName: initialData?.customerName || "",
      date: initialData
        ? new Date(initialData.start)
        : selectedDate || new Date(),
      startTime: getInitialStartTime(),
      endTime: getInitialEndTime(),
      description: initialData?.description || "",
      serviceOrderId: initialData?.serviceOrderId || "",
      technicianId: initialData?.technicianId,
      status: initialData?.status || "Agendado",
    },
  });

  const onSubmit = (data: FormValues) => {
    const startDate = new Date(data.date);
    const [startHours, startMinutes] = data.startTime.split(":").map(Number);
    startDate.setHours(startHours, startMinutes, 0);

    const endDate = new Date(data.date);
    const [endHours, endMinutes] = data.endTime.split(":").map(Number);
    endDate.setHours(endHours, endMinutes, 0);

    // Encontra o cliente e o técnico selecionados
    const customer = customerOptions.find((c) => c.id === data.customerId);
    const technician = technicianOptions.find((t) => t.id === data.technicianId);

    // Encontra a cor para o status selecionado
    const statusOption = appointmentStatusOptions.find(
      (s) => s.value === data.status
    );

    const formattedData: Appointment = {
      id:
        data.id ||
        `A${new Date().getFullYear()}${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
      title: data.title,
      customerId: data.customerId,
      customerName: customer ? customer.name : data.customerName || "Cliente não selecionado",
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      description: data.description || "",
      serviceOrderId: data.serviceOrderId || undefined,
      technicianId: data.technicianId,
      technicianName: technician ? technician.name : undefined,
      status: data.status as any,
      color: statusOption?.color || "#2196f3",
    };

    onSave(formattedData);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Agendamento" : "Novo Agendamento"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Título */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <Input placeholder="Título do agendamento" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cliente */}
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    value={field.value?.toString() || ""}
                    onValueChange={(value) =>
                      field.onChange(value ? Number(value) : undefined)
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customerOptions.map((customer) => (
                        <SelectItem
                          key={customer.id}
                          value={customer.id.toString()}
                        >
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Horário de início e fim */}
            <div className="grid grid-cols-2 gap-4">
              {/* Horário de Início */}
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário de Início</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Horário inicial" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTimeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Horário de Fim */}
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário de Fim</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Horário final" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTimeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Técnico Responsável */}
            <FormField
              control={form.control}
              name="technicianId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Técnico Responsável</FormLabel>
                  <Select
                    value={field.value?.toString() || ""}
                    onValueChange={(value) =>
                      field.onChange(value ? Number(value) : undefined)
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o técnico" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {technicianOptions.map((technician) => (
                        <SelectItem
                          key={technician.id}
                          value={technician.id.toString()}
                        >
                          {technician.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Status do agendamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {appointmentStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ordem de Serviço Relacionada (opcional) */}
            <FormField
              control={form.control}
              name="serviceOrderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ordem de Serviço (opcional)</FormLabel>
                  <Input placeholder="Número da OS" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descrição */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <Textarea
                    placeholder="Detalhes do agendamento"
                    className="min-h-[80px]"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentForm;
