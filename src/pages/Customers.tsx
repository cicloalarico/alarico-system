
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { Search, Plus } from "lucide-react";
import CustomersList from "@/components/customers/CustomersList";
import CustomerForm from "@/components/customers/CustomerForm";
import CustomerDetails from "@/components/customers/CustomerDetails";
import { Customer } from "@/types";
import { useCustomers } from "@/hooks/useCustomers";
import { Skeleton } from "@/components/ui/skeleton";

const Customers = () => {
  const { toast } = useToast();
  const { customers, loading, createCustomer, updateCustomer, deleteCustomer } = useCustomers();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Partial<Customer>>({});
  const [deleteCustomerId, setDeleteCustomerId] = useState<number | null>(null);
  
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.cpf && customer.cpf.includes(searchTerm))
  );

  const handleFieldChange = (field: string, value: any) => {
    setSelectedCustomer({ ...selectedCustomer, [field]: value });
  };

  const validateForm = () => {
    if (!selectedCustomer.name || !selectedCustomer.email || !selectedCustomer.cpf) {
      toast({
        title: "Erro ao adicionar cliente",
        description: "Por favor, preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleAddCustomer = async () => {
    if (!validateForm()) return;

    try {
      await createCustomer({
        name: selectedCustomer.name!,
        email: selectedCustomer.email!,
        phone: selectedCustomer.phone || "",
        cpf: selectedCustomer.cpf!,
        address: selectedCustomer.address || "",
        notes: selectedCustomer.notes || "",
      });
      
      setIsAddDialogOpen(false);
      setSelectedCustomer({});
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
    }
  };

  const handleEditCustomer = async () => {
    if (!validateForm() || !selectedCustomer.id) return;

    try {
      await updateCustomer(selectedCustomer.id, {
        name: selectedCustomer.name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone,
        cpf: selectedCustomer.cpf,
        address: selectedCustomer.address,
        notes: selectedCustomer.notes,
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
    }
  };

  const handleDeleteCustomer = async () => {
    if (deleteCustomerId) {
      try {
        await deleteCustomer(deleteCustomerId);
        setIsDeleteDialogOpen(false);
        setDeleteCustomerId(null);
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
      }
    }
  };

  const openAddDialog = () => {
    setSelectedCustomer({
      name: "",
      email: "",
      phone: "",
      cpf: "",
      address: "",
      notes: "",
    });
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (customer: Customer) => {
    setSelectedCustomer({ ...customer });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (customerId: number) => {
    setDeleteCustomerId(customerId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button onClick={openAddDialog} className="flex items-center gap-1">
          <Plus size={16} /> Novo Cliente
        </Button>
      </div>

      <div className="flex items-center border rounded-md px-3 py-2">
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        <Input
          placeholder="Buscar por nome, email ou CPF..."
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <CustomersList 
          customers={filteredCustomers} 
          onView={openViewDialog}
          onEdit={openEditDialog} 
          onDelete={openDeleteDialog}
        />
      )}

      {/* Dialog para adicionar cliente */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
          </DialogHeader>
          <CustomerForm 
            customer={selectedCustomer}
            onChange={handleFieldChange}
            onSubmit={handleAddCustomer}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog para editar cliente */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <CustomerForm 
            customer={selectedCustomer}
            onChange={handleFieldChange}
            onSubmit={handleEditCustomer}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog para visualizar cliente */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          {selectedCustomer.id && (
            <CustomerDetails customer={selectedCustomer as Customer} />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              openEditDialog(selectedCustomer as Customer);
            }}>
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Customers;
