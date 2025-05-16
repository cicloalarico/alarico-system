
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export const useUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar todos os usuários
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      if (data) {
        const formattedUsers = data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          password: '', // Não incluímos a senha real nos dados do cliente
          department: user.department || undefined,
          isActive: user.is_active,
          profileId: user.profile_id || undefined,
          lastLogin: user.last_login ? format(new Date(user.last_login), 'yyyy-MM-dd HH:mm') : '',
          createdAt: user.created_at ? format(new Date(user.created_at), 'yyyy-MM-dd HH:mm') : ''
        }));
        setUsers(formattedUsers);
      }
    } catch (err: any) {
      console.error('Erro ao buscar usuários:', err);
      setError(err.message || 'Erro ao buscar usuários');
      toast({
        title: "Erro",
        description: `Falha ao carregar usuários: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para criar um novo usuário
  const createUser = async (userData: Partial<User>) => {
    try {
      if (!userData.name || !userData.email || !userData.password || !userData.role) {
        throw new Error('Dados de usuário incompletos');
      }

      const { data, error } = await supabase.from('users').insert({
        name: userData.name,
        email: userData.email,
        password: userData.password, // Em produção, seria necessário implementar hash de senha
        role: userData.role as any,
        department: userData.department || null,
        profile_id: userData.profileId || null,
        is_active: userData.isActive !== false,
      }).select();

      if (error) throw error;

      if (data && data[0]) {
        const newUser: User = {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email,
          role: data[0].role,
          password: '',
          department: data[0].department || undefined,
          profileId: data[0].profile_id || undefined,
          isActive: data[0].is_active,
          lastLogin: data[0].last_login ? format(new Date(data[0].last_login), 'yyyy-MM-dd HH:mm') : '',
          createdAt: data[0].created_at ? format(new Date(data[0].created_at), 'yyyy-MM-dd HH:mm') : ''
        };

        setUsers(prev => [...prev, newUser]);
        
        toast({
          title: "Sucesso",
          description: "Usuário criado com sucesso",
        });
        
        return newUser;
      }
    } catch (err: any) {
      console.error('Erro ao criar usuário:', err);
      toast({
        title: "Erro",
        description: `Falha ao criar usuário: ${err.message}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Função para atualizar um usuário existente
  const updateUser = async (userId: number, userData: Partial<User>) => {
    try {
      const updateData: any = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department || null,
        profile_id: userData.profileId || null,
        is_active: userData.isActive
      };

      // Atualiza a senha apenas se uma nova senha for fornecida
      if (userData.password) {
        updateData.password = userData.password;
      }

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const updatedUser: User = {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email,
          role: data[0].role,
          password: '',
          department: data[0].department || undefined,
          profileId: data[0].profile_id || undefined,
          isActive: data[0].is_active,
          lastLogin: data[0].last_login ? format(new Date(data[0].last_login), 'yyyy-MM-dd HH:mm') : '',
          createdAt: data[0].created_at ? format(new Date(data[0].created_at), 'yyyy-MM-dd HH:mm') : ''
        };

        setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user));
        
        toast({
          title: "Sucesso",
          description: "Usuário atualizado com sucesso",
        });
        
        return updatedUser;
      }
    } catch (err: any) {
      console.error('Erro ao atualizar usuário:', err);
      toast({
        title: "Erro",
        description: `Falha ao atualizar usuário: ${err.message}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Função para excluir um usuário
  const deleteUser = async (userId: number) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.filter(user => user.id !== userId));
      
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
      });
      
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir usuário:', err);
      toast({
        title: "Erro",
        description: `Falha ao excluir usuário: ${err.message}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Função para alternar o status ativo/inativo do usuário
  const toggleUserActive = async (userId: number, isActive: boolean) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ is_active: isActive })
        .eq('id', userId)
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setUsers(prev => prev.map(user => user.id === userId ? { ...user, isActive } : user));
        
        toast({
          title: "Sucesso",
          description: `Usuário ${isActive ? 'ativado' : 'desativado'} com sucesso`,
        });
        
        return true;
      }
    } catch (err: any) {
      console.error('Erro ao alternar status do usuário:', err);
      toast({
        title: "Erro",
        description: `Falha ao ${isActive ? 'ativar' : 'desativar'} usuário: ${err.message}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Carregar usuários na montagem do componente
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserActive
  };
};
