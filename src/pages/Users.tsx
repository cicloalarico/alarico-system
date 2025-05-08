
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, MoreHorizontal, Edit, Trash2, UserRound, ShieldCheck, ShieldAlert } from "lucide-react";

// Mock user data
const initialUsers = [
  {
    id: 1,
    name: "José Silva",
    email: "jose.silva@ciclolarico.com.br",
    role: "administrador",
    department: "Direção",
    active: true,
    lastLogin: "2024-05-07 08:32",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@ciclolarico.com.br",
    role: "gerente",
    department: "Vendas",
    active: true,
    lastLogin: "2024-05-07 09:15",
  },
  {
    id: 3,
    name: "Pedro Almeida",
    email: "pedro.almeida@ciclolarico.com.br",
    role: "técnico",
    department: "Manutenção",
    active: true,
    lastLogin: "2024-05-06 16:45",
  },
  {
    id: 4,
    name: "Ana Ferreira",
    email: "ana.ferreira@ciclolarico.com.br",
    role: "vendedor",
    department: "Vendas",
    active: false,
    lastLogin: "2024-04-30 14:21",
  },
  {
    id: 5,
    name: "Carlos Ribeiro",
    email: "carlos.ribeiro@ciclolarico.com.br",
    role: "técnico",
    department: "Manutenção",
    active: true,
    lastLogin: "2024-05-07 10:05",
  },
];

const roles = [
  "administrador",
  "gerente",
  "técnico",
  "vendedor",
  "financeiro",
  "estoquista",
];

const departments = [
  "Direção",
  "Vendas",
  "Manutenção",
  "Financeiro",
  "Estoque",
  "Administrativo",
];

const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    active: true,
    password: ""
  });

  const filteredUsers = users.filter((user) =>
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (roleFilter ? user.role === roleFilter : true)
  );

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.password) {
      toast({
        title: "Erro ao adicionar usuário",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, forneça um endereço de e-mail válido.",
        variant: "destructive",
      });
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email === newUser.email)) {
      toast({
        title: "E-mail duplicado",
        description: "Este e-mail já está cadastrado no sistema.",
        variant: "destructive",
      });
      return;
    }

    const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const lastLogin = "-";
    
    setUsers([...users, { 
      id, 
      ...newUser,
      lastLogin
    }]);
    
    setNewUser({
      name: "",
      email: "",
      role: "",
      department: "",
      active: true,
      password: ""
    });
    
    setIsAddDialogOpen(false);
    
    toast({
      title: "Usuário adicionado",
      description: `${newUser.name} foi adicionado com sucesso.`,
    });
  };

  const handleEditUser = () => {
    if (!editingUser.name || !editingUser.email || !editingUser.role) {
      toast({
        title: "Erro ao editar usuário",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editingUser.email)) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, forneça um endereço de e-mail válido.",
        variant: "destructive",
      });
      return;
    }

    // Check if email already exists (except for this user)
    if (users.some(user => user.email === editingUser.email && user.id !== editingUser.id)) {
      toast({
        title: "E-mail duplicado",
        description: "Este e-mail já está cadastrado no sistema.",
        variant: "destructive",
      });
      return;
    }

    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Usuário atualizado",
      description: `${editingUser.name} foi atualizado com sucesso.`,
    });
  };

  const handleDeleteUser = (id: number) => {
    const userToDelete = users.find(user => user.id === id);
    
    if (userToDelete) {
      setUsers(users.filter(user => user.id !== id));
      
      toast({
        title: "Usuário removido",
        description: `${userToDelete.name} foi removido com sucesso.`,
      });
    }
  };

  const handleToggleActive = (id: number) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        const newActiveState = !user.active;
        
        toast({
          title: newActiveState ? "Usuário ativado" : "Usuário desativado",
          description: `${user.name} foi ${newActiveState ? "ativado" : "desativado"} com sucesso.`,
        });
        
        return { ...user, active: newActiveState };
      }
      return user;
    }));
  };

  const handleEditClick = (user: any) => {
    setEditingUser({ ...user });
    setIsEditDialogOpen(true);
  };

  const handleNewUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleEditUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus size={16} /> Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  name="name"
                  value={newUser.name}
                  onChange={handleNewUserInput}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newUser.email}
                  onChange={handleNewUserInput}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={newUser.password}
                  onChange={handleNewUserInput}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Perfil *</Label>
                  <Select 
                    value={newUser.role} 
                    onValueChange={(value) => setNewUser({...newUser, role: value})}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select 
                    value={newUser.department} 
                    onValueChange={(value) => setNewUser({...newUser, department: value})}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="active" 
                  checked={newUser.active}
                  onCheckedChange={(checked) => setNewUser({...newUser, active: checked})}
                />
                <Label htmlFor="active">Usuário ativo</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddUser}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center border rounded-md px-3 py-2 flex-1">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <Input
            placeholder="Buscar por nome ou email..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os perfis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os perfis</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden md:table-cell">E-mail</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead className="hidden md:table-cell">Departamento</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Último Acesso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <UserRound size={16} className="text-gray-400" />
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {user.role === "administrador" && (
                        <ShieldCheck size={14} className="text-red-500" />
                      )}
                      {user.role === "gerente" && (
                        <ShieldAlert size={14} className="text-blue-500" />
                      )}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{user.department}</TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {user.active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleEditClick(user)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => handleToggleActive(user.id)}
                        >
                          {user.active ? (
                            <>
                              <ShieldAlert className="mr-2 h-4 w-4" /> Desativar
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="mr-2 h-4 w-4" /> Ativar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600"
                          onClick={() => handleDeleteUser(user.id)}
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

      {/* Edit user dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-name">Nome completo *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={editingUser.name}
                  onChange={handleEditUserInput}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-email">E-mail *</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={editingUser.email}
                  onChange={handleEditUserInput}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Perfil *</Label>
                  <Select 
                    value={editingUser.role} 
                    onValueChange={(value) => setEditingUser({...editingUser, role: value})}
                  >
                    <SelectTrigger id="edit-role">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Departamento</Label>
                  <Select 
                    value={editingUser.department} 
                    onValueChange={(value) => setEditingUser({...editingUser, department: value})}
                  >
                    <SelectTrigger id="edit-department">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="edit-active" 
                  checked={editingUser.active}
                  onCheckedChange={(checked) => setEditingUser({...editingUser, active: checked})}
                />
                <Label htmlFor="edit-active">Usuário ativo</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
