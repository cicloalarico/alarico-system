
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { UserPlus } from "lucide-react";
import UserForm from "@/components/users/UserForm";
import UsersList from "@/components/users/UsersList";
import { User } from "@/types";
import { useUsers } from "@/hooks/useUsers";
import { Skeleton } from "@/components/ui/skeleton";

const Users = () => {
  const { users, loading, createUser, updateUser, deleteUser, toggleUserActive } = useUsers();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "user",
    password: "",
    department: "",
    isActive: true,
  });

  // Filtrar usuários com base na pesquisa
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Manipuladores de eventos para o formulário de usuário
  const handleCreateUserFormChange = (field: string, value: any) => {
    setUserFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditUserFormChange = (field: string, value: any) => {
    if (selectedUser) {
      setSelectedUser((prev) => prev ? ({
        ...prev,
        [field]: value,
      }) : null);
    }
  };

  // Manipuladores para criar/editar/excluir usuários
  const handleCreateUser = async () => {
    try {
      if (userFormData.password !== userFormData.confirmPassword) {
        throw new Error("As senhas não conferem");
      }
      
      await createUser(userFormData);
      setIsAddDialogOpen(false);
      setUserFormData({
        name: "",
        email: "",
        role: "user",
        password: "",
        confirmPassword: "",
        department: "",
        isActive: true,
      });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
    }
  };

  const handleUpdateUser = async () => {
    if (selectedUser) {
      try {
        if (
          selectedUser.password &&
          selectedUser.password !== selectedUser.confirmPassword
        ) {
          throw new Error("As senhas não conferem");
        }
        
        await updateUser(selectedUser.id, selectedUser);
        setIsEditDialogOpen(false);
        setSelectedUser(null);
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser.id);
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
      }
    }
  };

  const handleToggleUserActive = async (userId: number, isActive: boolean) => {
    try {
      await toggleUserActive(userId, isActive);
    } catch (error) {
      console.error("Erro ao alternar status do usuário:", error);
    }
  };

  // Manipuladores para abrir diálogos
  const openEditDialog = (user: User) => {
    setSelectedUser({ ...user, password: "", confirmPassword: "" });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Pesquisar usuários..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <UsersList
          users={filteredUsers}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          onToggleActive={handleToggleUserActive}
        />
      )}

      {/* Diálogo para adicionar usuário */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Usuário</DialogTitle>
          </DialogHeader>
          <UserForm
            user={userFormData}
            onChange={handleCreateUserFormChange}
            onSubmit={handleCreateUser}
            isEditing={false}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar usuário */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              user={selectedUser}
              onChange={handleEditUserFormChange}
              onSubmit={handleUpdateUser}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário "{selectedUser?.name}"?
              Esta ação não pode ser desfeita.
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
    </div>
  );
};

export default Users;
