
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from "@/types";

interface ProfileFormProps {
  profile: Partial<UserProfile>;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onChange, onSubmit }) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Perfil *</Label>
        <Input
          id="name"
          value={profile.name || ""}
          onChange={(e) => onChange("name", e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={profile.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="flex justify-end">
        <Button type="submit">
          {profile.id ? "Atualizar Perfil" : "Adicionar Perfil"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
