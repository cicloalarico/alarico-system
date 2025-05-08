
import React from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, UserCheck, UserX } from "lucide-react";
import { User } from "@/types";

interface UsersListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
  onToggleActive: (userId: number, isActive: boolean) => void;
}

const UsersList: React.FC<UsersListProps> = ({ 
  users, 
  onEdit, 
  onDelete,
  onToggleActive
}) => {
  if (users.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-100">
        <div className="text-gray-500">Nenhum usuário encontrado</div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Perfil</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="hidden md:table-cell">
                {user.role === "admin" ? "Administrador" : 
                 user.role === "tech" ? "Técnico" : 
                 user.role === "seller" ? "Vendedor" : "Usuário"}
              </TableCell>
              <TableCell className="text-center">
                {user.isActive ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                    Inativo
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Edit className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    {user.isActive ? (
                      <DropdownMenuItem onClick={() => onToggleActive(user.id, false)}>
                        <UserX className="mr-2 h-4 w-4" /> Desativar
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => onToggleActive(user.id, true)}>
                        <UserCheck className="mr-2 h-4 w-4" /> Ativar
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      className="text-red-600" 
                      onClick={() => onDelete(user.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersList;
