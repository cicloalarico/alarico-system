
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";

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
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    address: "",
    notes: "",
  });

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.cpf.includes(searchTerm)
  );

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.cpf) {
      toast({
        title: "Erro ao adicionar cliente",
        description: "Por favor, preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const id = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    
    setCustomers([...customers, { id, ...newCustomer }]);
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      cpf: "",
      address: "",
      notes: "",
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Cliente adicionado",
      description: `${newCustomer.name} foi adicionado com sucesso.`,
    });
  };

  const handleEditCustomer = () => {
    if (!editingCustomer.name || !editingCustomer.email || !editingCustomer.cpf) {
      toast({
        title: "Erro ao editar cliente",
        description: "Por favor, preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setCustomers(customers.map(customer => 
      customer.id === editingCustomer.id ? editingCustomer : customer
    ));
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Cliente atualizado",
      description: `${editingCustomer.name} foi atualizado com sucesso.`,
    });
  };

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (customer: any) => {
    setEditingCustomer({ ...customer });
    setIsEditDialogOpen(true);
  };

  const handleDeleteCustomer = (id: number) => {
    const customerToDelete = customers.find((c) => c.id === id);
    setCustomers(customers.filter((customer) => customer.id !== id));
    
    toast({
      title: "Cliente removido",
      description: `${customerToDelete?.name} foi removido com sucesso.`,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingCustomer({ ...editingCustomer, [name]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus size={16} /> Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newCustomer.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF/CNPJ *</Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    value={newCustomer.cpf}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={newCustomer.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  value={newCustomer.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={newCustomer.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddCustomer}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF/CNPJ</TableHead>
              <TableHead className="hidden md:table-cell">E-mail</TableHead>
              <TableHead className="hidden md:table-cell">Telefone</TableHead>
              <TableHead className="hidden lg:table-cell">Observações</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.cpf}</TableCell>
                  <TableCell className="hidden md:table-cell">{customer.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{customer.phone}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {customer.notes ? (
                      <span className={customer.notes.toLowerCase().includes("inadimplente") 
                        ? "text-red-500" 
                        : customer.notes.toLowerCase().includes("vip") 
                          ? "text-green-600" 
                          : "text-gray-600"}>
                        {customer.notes}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => handleEditClick(customer)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600"
                          onClick={() => handleDeleteCustomer(customer.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View customer dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nome</p>
                  <p>{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">CPF/CNPJ</p>
                  <p>{selectedCustomer.cpf}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">E-mail</p>
                  <p>{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Telefone</p>
                  <p>{selectedCustomer.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Endereço</p>
                <p>{selectedCustomer.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Observações</p>
                <p>{selectedCustomer.notes || "-"}</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-500 mb-2">Histórico</p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Nenhuma compra ou serviço registrado.</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              handleEditClick(selectedCustomer);
            }}>
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit customer dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          {editingCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome completo *</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={editingCustomer.name}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cpf">CPF/CNPJ *</Label>
                  <Input
                    id="edit-cpf"
                    name="cpf"
                    value={editingCustomer.cpf}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">E-mail *</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    value={editingCustomer.email}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Telefone</Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    value={editingCustomer.phone}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Endereço</Label>
                <Input
                  id="edit-address"
                  name="address"
                  value={editingCustomer.address}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Observações</Label>
                <Textarea
                  id="edit-notes"
                  name="notes"
                  value={editingCustomer.notes}
                  onChange={handleEditInputChange}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditCustomer}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
