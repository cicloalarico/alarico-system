
import React, { useState, useEffect } from "react";
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
import { User, UserProfile } from "@/types";
import { useUserProfiles } from "@/hooks/useUserProfiles";
import { Skeleton } from "@/components/ui/skeleton";

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
  isEditing,
}) => {
  const { profiles, loading: loadingProfiles, fetchProfiles } = useUserProfiles();
  const [loadingForm, setLoadingForm] = useState(true);

  useEffect(() => {
    const initializeForm = async () => {
      await fetchProfiles();
      setLoadingForm(false);
    };
    
    initializeForm();
  }, []);

  if (loadingForm || loadingProfiles) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Cargo *</Label>
            <Select
              value={user.role}
              onValueChange={(value) => onChange("role", value)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecione um cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="mechanic">Mecânico</SelectItem>
                <SelectItem value="seller">Vendedor</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
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

        <div className="space-y-2">
          <Label htmlFor="profileId">Perfil de Acesso</Label>
          <Select
            value={user.profileId ? String(user.profileId) : undefined}
            onValueChange={(value) => onChange("profileId", value ? parseInt(value) : null)}
          >
            <SelectTrigger id="profileId">
              <SelectValue placeholder="Selecione um perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Nenhum</SelectItem>
              {profiles.map(profile => (
                <SelectItem key={profile.id} value={String(profile.id)}>
                  {profile.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{isEditing ? "Nova Senha" : "Senha *"}</Label>
          <Input
            id="password"
            type="password"
            value={user.password || ""}
            onChange={(e) => onChange("password", e.target.value)}
            required={!isEditing}
          />
        </div>

        {(isEditing ? !!user.password : true) && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {isEditing ? "Confirmar Nova Senha" : "Confirmar Senha *"}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={user.confirmPassword || ""}
              onChange={(e) => onChange("confirmPassword", e.target.value)}
              required={isEditing ? !!user.password : true}
            />
          </div>
        )}

        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="isActive"
            checked={user.isActive !== false}
            onCheckedChange={(checked) => onChange("isActive", checked)}
          />
          <Label htmlFor="isActive">Usuário Ativo</Label>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit">
          {isEditing ? "Atualizar Usuário" : "Criar Usuário"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
