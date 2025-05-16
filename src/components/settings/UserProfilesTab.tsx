
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Pencil, Trash2, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UserProfile } from "@/types";
import { useUserProfiles } from "@/hooks/useUserProfiles";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileForm from "./ProfileForm";
import PermissionsForm from "./PermissionsForm";

const UserProfilesTab: React.FC = () => {
  const { profiles, loading, createProfile, updateProfile, deleteProfile } = useUserProfiles();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [profileFormData, setProfileFormData] = useState<Partial<UserProfile>>({
    name: "",
    description: "",
  });

  // Manipuladores de eventos para o formulário de perfil
  const handleFormChange = (field: string, value: any) => {
    setProfileFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditFormChange = (field: string, value: any) => {
    if (selectedProfile) {
      setSelectedProfile((prev) => prev ? ({
        ...prev,
        [field]: value,
      }) : null);
    }
  };

  // Manipuladores para criar/editar/excluir perfis
  const handleCreateProfile = async () => {
    try {
      await createProfile(profileFormData);
      setIsAddDialogOpen(false);
      setProfileFormData({
        name: "",
        description: "",
      });
    } catch (error) {
      console.error("Erro ao criar perfil:", error);
    }
  };

  const handleUpdateProfile = async () => {
    if (selectedProfile) {
      try {
        await updateProfile(selectedProfile.id, selectedProfile);
        setIsEditDialogOpen(false);
        setSelectedProfile(null);
      } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
      }
    }
  };

  const handleDeleteProfile = async () => {
    if (selectedProfile) {
      try {
        await deleteProfile(selectedProfile.id);
        setIsDeleteDialogOpen(false);
        setSelectedProfile(null);
      } catch (error) {
        console.error("Erro ao excluir perfil:", error);
      }
    }
  };

  // Manipuladores para abrir diálogos
  const openEditDialog = (profile: UserProfile) => {
    setSelectedProfile({ ...profile });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setIsDeleteDialogOpen(true);
  };

  const openPermissionsDialog = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setIsPermissionsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Perfis de Usuários</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <UserPlus size={16} />
          Novo Perfil
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <div className="grid gap-4">
          {profiles.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center p-6 text-muted-foreground">
                Nenhum perfil de usuário cadastrado
              </CardContent>
            </Card>
          ) : (
            profiles.map((profile) => (
              <Card key={profile.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{profile.name}</h3>
                      {profile.description && (
                        <p className="text-muted-foreground text-sm">{profile.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => openPermissionsDialog(profile)}
                        title="Configurar permissões"
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => openEditDialog(profile)}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => openDeleteDialog(profile)}
                        className="text-red-500 hover:text-red-700"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Diálogo para adicionar perfil */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Perfil</DialogTitle>
          </DialogHeader>
          <ProfileForm
            profile={profileFormData}
            onChange={handleFormChange}
            onSubmit={handleCreateProfile}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar perfil */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>
          {selectedProfile && (
            <ProfileForm
              profile={selectedProfile}
              onChange={handleEditFormChange}
              onSubmit={handleUpdateProfile}
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
              Tem certeza que deseja excluir o perfil "{selectedProfile?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProfile} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo para configurar permissões */}
      <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Permissões - {selectedProfile?.name}</DialogTitle>
          </DialogHeader>
          {selectedProfile && (
            <PermissionsForm
              profileId={selectedProfile.id}
              onSave={() => setIsPermissionsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfilesTab;
