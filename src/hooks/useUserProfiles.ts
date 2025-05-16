
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { UserProfile, PagePermission } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export const useUserProfiles = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [permissions, setPermissions] = useState<PagePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar todos os perfis
  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      if (data) {
        const formattedProfiles = data.map(profile => ({
          id: profile.id,
          name: profile.name,
          description: profile.description || undefined,
          createdAt: profile.created_at ? format(new Date(profile.created_at), 'yyyy-MM-dd HH:mm') : ''
        }));
        setProfiles(formattedProfiles);
      }
    } catch (err: any) {
      console.error('Erro ao buscar perfis:', err);
      setError(err.message || 'Erro ao buscar perfis');
      toast({
        title: "Erro",
        description: `Falha ao carregar perfis: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar permissões de um perfil
  const fetchProfilePermissions = async (profileId: number) => {
    try {
      const { data, error } = await supabase
        .from('page_permissions')
        .select('*')
        .eq('profile_id', profileId);
      
      if (error) throw error;
      
      if (data) {
        const formattedPermissions = data.map(permission => ({
          id: permission.id,
          profileId: permission.profile_id,
          pageName: permission.page_name,
          canView: permission.can_view,
          canEdit: permission.can_edit
        }));
        setPermissions(formattedPermissions);
        return formattedPermissions;
      }
      return [];
    } catch (err: any) {
      console.error('Erro ao buscar permissões:', err);
      toast({
        title: "Erro",
        description: `Falha ao carregar permissões: ${err.message}`,
        variant: "destructive",
      });
      return [];
    }
  };

  // Função para criar um novo perfil
  const createProfile = async (profileData: Partial<UserProfile>) => {
    try {
      if (!profileData.name) {
        throw new Error('Nome do perfil é obrigatório');
      }

      const { data, error } = await supabase.from('user_profiles').insert({
        name: profileData.name,
        description: profileData.description || null
      }).select();

      if (error) throw error;

      if (data && data[0]) {
        const newProfile: UserProfile = {
          id: data[0].id,
          name: data[0].name,
          description: data[0].description || undefined,
          createdAt: data[0].created_at ? format(new Date(data[0].created_at), 'yyyy-MM-dd HH:mm') : ''
        };

        setProfiles(prev => [...prev, newProfile]);
        
        toast({
          title: "Sucesso",
          description: "Perfil criado com sucesso",
        });
        
        return newProfile;
      }
    } catch (err: any) {
      console.error('Erro ao criar perfil:', err);
      toast({
        title: "Erro",
        description: `Falha ao criar perfil: ${err.message}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Função para atualizar um perfil existente
  const updateProfile = async (profileId: number, profileData: Partial<UserProfile>) => {
    try {
      const updateData: any = {
        name: profileData.name,
        description: profileData.description || null
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', profileId)
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const updatedProfile: UserProfile = {
          id: data[0].id,
          name: data[0].name,
          description: data[0].description || undefined,
          createdAt: data[0].created_at ? format(new Date(data[0].created_at), 'yyyy-MM-dd HH:mm') : ''
        };

        setProfiles(prev => prev.map(profile => profile.id === profileId ? updatedProfile : profile));
        
        toast({
          title: "Sucesso",
          description: "Perfil atualizado com sucesso",
        });
        
        return updatedProfile;
      }
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      toast({
        title: "Erro",
        description: `Falha ao atualizar perfil: ${err.message}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Função para excluir um perfil
  const deleteProfile = async (profileId: number) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', profileId);

      if (error) throw error;

      setProfiles(prev => prev.filter(profile => profile.id !== profileId));
      
      toast({
        title: "Sucesso",
        description: "Perfil excluído com sucesso",
      });
      
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir perfil:', err);
      toast({
        title: "Erro",
        description: `Falha ao excluir perfil: ${err.message}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Função para salvar permissões de um perfil
  const saveProfilePermissions = async (profileId: number, permissions: Partial<PagePermission>[]) => {
    try {
      // Primeiro, excluir todas as permissões existentes para este perfil
      const { error: deleteError } = await supabase
        .from('page_permissions')
        .delete()
        .eq('profile_id', profileId);
        
      if (deleteError) throw deleteError;
      
      // Agora, inserir as novas permissões
      const permissionsData = permissions.map(permission => ({
        profile_id: profileId,
        page_name: permission.pageName,
        can_view: permission.canView !== undefined ? permission.canView : true,
        can_edit: permission.canEdit !== undefined ? permission.canEdit : false
      }));
      
      const { data, error } = await supabase
        .from('page_permissions')
        .insert(permissionsData)
        .select();
        
      if (error) throw error;
      
      if (data) {
        const formattedPermissions = data.map(permission => ({
          id: permission.id,
          profileId: permission.profile_id,
          pageName: permission.page_name,
          canView: permission.can_view,
          canEdit: permission.can_edit
        }));
        
        setPermissions(formattedPermissions);
        
        toast({
          title: "Sucesso",
          description: "Permissões salvas com sucesso",
        });
        
        return formattedPermissions;
      }
    } catch (err: any) {
      console.error('Erro ao salvar permissões:', err);
      toast({
        title: "Erro",
        description: `Falha ao salvar permissões: ${err.message}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Carregar perfis na montagem do componente
  useEffect(() => {
    fetchProfiles();
  }, []);

  return {
    profiles,
    permissions,
    loading,
    error,
    fetchProfiles,
    fetchProfilePermissions,
    createProfile,
    updateProfile,
    deleteProfile,
    saveProfilePermissions
  };
};
