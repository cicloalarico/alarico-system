
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
import { Search, Plus, UserX, UserCheck } from "lucide-react";
import UsersList from "@/components/users/UsersList";
import UserForm from "@/components/users/UserForm";
import { User } from "@/types";

// Dados iniciais de usuários
const initialUsers = [
  {
    id: 1,
    name: "Admin Principal",
    email: "admin@cicloalarico.com.br",
    role: "admin",
    password: "",
    department: "Administração",
    isActive: true,
    lastLogin: "2024-05-08T10:30:00",
    createdAt: "2024-01-01T00:00:00",
  },
  {
    id: 2,
    name: "José Técnico",
    email: "jose.tech@cicloalarico.com.br",
    role: "tech",
    password: "",
    department: "Oficina",
    isActive: true,
    lastLogin: "2024-05-07T08:45:00",
    createdAt: "2024-01-15T00:00:00",
  },
  {
    id: 3,
    name: "Maria Vendedora",
    email: "maria.vendas@cicloalarico.com.br",
    role: "seller",
    password: "",
    department: "Vendas",
    isActive: true,
    lastLogin: "2024-05-08T09:15:00",
    createdAt: "2024-02-01T00:00:00",
  },
  {
    id: 4,
    name: "João Recepção",
    email: "joao@cicloalarico.com.br",
    role: "user",
    password: "",
    department: "Recepção",
    isActive: false,
    lastLogin: "2024-03-20T14:30:00",
    createdAt: "2024-02-15T00:00:00",
  },
];

const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Partial<User>>({});
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [statusChangeInfo, setStatusChangeInfo] = useState<{userId: number, activate: boolean} | null>(null);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleFieldChange = (field: string, value: any) => {
    setSelectedUser({ ...selectedUser, [field]: value });
  };

  const validateForm = () => {
    if (!selectedUser.name || !selectedUser.email || !selectedUser.role) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return false;
    }

    if (!isEditDialogOpen && (!selectedUser.password || selectedUser.password !== selectedUser.confirmPassword)) {
      toast({
        title: "Erro de validação",
        description: "As senhas não conferem ou estão em branco.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCreateUser = () => {
    if (!validateForm()) return;

    const newUser: User = {
      id: Math.max(...users.map(u => u.id)) + 1,
      name: selectedUser.name!,
      email: selectedUser.email!,
      role: selectedUser.role || "user",
      password: selectedUser.password || "",
      department: selectedUser.department || "",
      isActive: selectedUser.isActive !== false,
      lastLogin: "",
      createdAt: new Date().toISOString(),
    };

    setUsers([...users, newUser]);
    setIsCreateDialogOpen(false);

    toast({
      title: "Usuário criado",
      description: `${newUser.name} foi adicionado com sucesso.`,
    });
  };

  const handleEditUser = () => {
    if (!validateForm()) return;

    const updatedUsers = users.map(user => 
      user.id === selectedUser.id 
        ? { 
            ...user, 
            name: selectedUser.name!, 
            email: selectedUser.email!, 
            role: selectedUser.role!, 
            department: selectedUser.department, 
            isActive: selectedUser.isActive !== false
          } 
        : user
    );

    setUsers(updatedUsers);
    setIsEditDialogOpen(false);

    toast({
      title: "Usuário atualizado",
      description: `${selectedUser.name} foi atualizado com sucesso.`,
    });
  };

  const handleDeleteUser = () => {
    if (deleteUserId) {
      const userToDelete = users.find(user => user.id === deleteUserId);
      setUsers(users.filter(user => user.id !== deleteUserId));
      setIsDeleteDialogOpen(false);

      toast({
        title: "Usuário removido",
        description: `${userToDelete?.name} foi removido com sucesso.`,
      });
    }
  };

  const handleToggleUserStatus = () => {
    if (statusChangeInfo) {
      const updatedUsers = users.map(user => 
        user.id === statusChangeInfo.userId 
          ? { ...user, isActive: statusChangeInfo.activate } 
          : user
      );
      
      const user = users.find(user => user.id === statusChangeInfo.userId);
      
      setUsers(updatedUsers);
      setIsStatusDialogOpen(false);

      toast({
        title: statusChangeInfo.activate ? "Usuário ativado" : "Usuário desativado",
        description: `${user?.name} foi ${statusChangeInfo.activate ? "ativado" : "desativado"} com sucesso.`,
      });
    }
  };

  const openCreateDialog = () => {
    setSelectedUser({
      name: "",
      email: "",
      role: "user",
      password: "",
      confirmPassword: "",
      department: "",
      isActive: true
    });
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setSelectedUser({ ...user, password: "", confirmPassword: "" });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (userId: number) => {
    setDeleteUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  const openStatusDialog = (userId: number, activate: boolean) => {
    setStatusChangeInfo({ userId, activate });
    setIsStatusDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
        <Button onClick={openCreateDialog} className="flex items-center gap-1">
          <Plus size={16} /> Novo Usuário
        </Button>
      </div>

      <div className="flex items-center border rounded-md px-3 py-2">
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        <Input
          placeholder="Buscar por nome, email ou departamento..."
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <UsersList 
        users={filteredUsers} 
        onEdit={openEditDialog} 
        onDelete={openDeleteDialog}
        onToggleActive={openStatusDialog}
      />

      {/* Dialog para criar usuário */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          </DialogHeader>
          <UserForm 
            user={selectedUser}
            onChange={handleFieldChange}
            onSubmit={handleCreateUser}
            isEditing={false}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog para editar usuário */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <UserForm 
            user={selectedUser}
            onChange={handleFieldChange}
            onSubmit={handleEditUser}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog para confirmar mudança de status */}
      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {statusChangeInfo?.activate ? "Ativar usuário" : "Desativar usuário"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {statusChangeInfo?.activate
                ? "Você tem certeza que deseja ativar este usuário? Ele poderá acessar o sistema novamente."
                : "Você tem certeza que deseja desativar este usuário? Ele não poderá mais acessar o sistema."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleUserStatus} className={
              statusChangeInfo?.activate ? "bg-green-600 hover:bg-green-700" : "bg-amber-600 hover:bg-amber-700"
            }>
              {statusChangeInfo?.activate ? "Ativar" : "Desativar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Users;
