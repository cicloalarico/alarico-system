
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
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus } from "lucide-react";
import CustomersList from "@/components/customers/CustomersList";
import CustomerForm from "@/components/customers/CustomerForm";
import CustomerDetails from "@/components/customers/CustomerDetails";
import { Customer } from "@/types";

// Mock customer data
const initialCustomers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321",
    cpf: "123.456.789-00",
    address: "Rua das Flores, 123 - São Paulo/SP",
    notes: "Cliente VIP",
  },
  {
    id: 2,
    name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    phone: "(11) 91234-5678",
    cpf: "987.654.321-00",
    address: "Av. Paulista, 1000 - São Paulo/SP",
    notes: "",
  },
  {
    id: 3,
    name: "Carlos Santos",
    email: "carlos.santos@email.com",
    phone: "(11) 95555-1234",
    cpf: "456.789.123-00",
    address: "Rua Augusta, 500 - São Paulo/SP",
    notes: "Cliente inadimplente",
  },
  {
    id: 4,
    name: "Ana Ferreira",
    email: "ana.ferreira@email.com",
    phone: "(11) 94444-5678",
    cpf: "789.123.456-00",
    address: "Av. Faria Lima, 2000 - São Paulo/SP",
    notes: "",
  },
  {
    id: 5,
    name: "Roberto Almeida",
    email: "roberto.almeida@email.com",
    phone: "(11) 93333-9999",
    cpf: "321.654.987-00",
    address: "Rua Oscar Freire, 300 - São Paulo/SP",
    notes: "",
  },
];

const Customers = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
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
    customer.cpf.includes(searchTerm)
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

  const handleAddCustomer = () => {
    if (!validateForm()) return;

    const id = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    
    const newCustomer: Customer = {
      id,
      name: selectedCustomer.name!,
      email: selectedCustomer.email!,
      phone: selectedCustomer.phone || "",
      cpf: selectedCustomer.cpf!,
      address: selectedCustomer.address || "",
      notes: selectedCustomer.notes || "",
    };
    
    setCustomers([...customers, newCustomer]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Cliente adicionado",
      description: `${newCustomer.name} foi adicionado com sucesso.`,
    });
  };

  const handleEditCustomer = () => {
    if (!validateForm()) return;

    setCustomers(customers.map(customer => 
      customer.id === selectedCustomer.id ? {
        ...customer,
        name: selectedCustomer.name!,
        email: selectedCustomer.email!,
        phone: selectedCustomer.phone || "",
        cpf: selectedCustomer.cpf!,
        address: selectedCustomer.address || "",
        notes: selectedCustomer.notes || "",
      } : customer
    ));
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Cliente atualizado",
      description: `${selectedCustomer.name} foi atualizado com sucesso.`,
    });
  };

  const handleDeleteCustomer = () => {
    if (deleteCustomerId) {
      const customerToDelete = customers.find(c => c.id === deleteCustomerId);
      setCustomers(customers.filter(c => c.id !== deleteCustomerId));
      
      toast({
        title: "Cliente removido",
        description: `${customerToDelete?.name} foi removido com sucesso.`,
      });
      
      setIsDeleteDialogOpen(false);
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

      <CustomersList 
        customers={filteredCustomers} 
        onView={openViewDialog}
        onEdit={openEditDialog} 
        onDelete={openDeleteDialog}
      />

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
