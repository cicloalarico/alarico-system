
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { User } from "@/types";

interface UserFormProps {
  user: Partial<User>;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
  isEditing: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ 
  user, 
  onChange, 
  onSubmit, 
  isEditing 
}) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo *</Label>
          <Input
            id="name"
            value={user.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={user.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
            required
          />
        </div>
      </div>

      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Senha *</Label>
            <Input
              id="password"
              type="password"
              value={user.password || ""}
              onChange={(e) => onChange("password", e.target.value)}
              required={!isEditing}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha *</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={user.confirmPassword || ""}
              onChange={(e) => onChange("confirmPassword", e.target.value)}
              required={!isEditing}
              autoComplete="new-password"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Perfil *</Label>
          <Select
            value={user.role || "user"}
            onValueChange={(value) => onChange("role", value)}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Selecione o perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="tech">Técnico</SelectItem>
              <SelectItem value="seller">Vendedor</SelectItem>
              <SelectItem value="user">Usuário padrão</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Departamento</Label>
          <Input
            id="department"
            value={user.department || ""}
            onChange={(e) => onChange("department", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={user.isActive !== false}
          onCheckedChange={(checked) => onChange("isActive", checked)}
        />
        <Label htmlFor="isActive">Usuário ativo</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          {isEditing ? "Atualizar usuário" : "Criar usuário"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
