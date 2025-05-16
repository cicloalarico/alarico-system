
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, User, Store, Bell, Lock, Users } from "lucide-react";
import UserProfilesTab from "@/components/settings/UserProfilesTab";

const Settings = () => {
  const { toast } = useToast();
  
  const saveSettings = (type: string) => {
    toast({
      title: "Configurações salvas",
      description: `As configurações de ${type} foram atualizadas com sucesso.`,
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-shop-primary">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie as configurações do sistema e suas preferências
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Gerais
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="mr-2 h-4 w-4" />
            Conta
          </TabsTrigger>
          <TabsTrigger value="business">
            <Store className="mr-2 h-4 w-4" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="profiles">
            <Users className="mr-2 h-4 w-4" />
            Perfis de Acesso
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="mr-2 h-4 w-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure as opções gerais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="theme">Tema do Sistema</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch id="theme" />
                  <Label htmlFor="theme">Modo Escuro</Label>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="language">Idioma</Label>
                <div className="flex items-center space-x-2">
                  <select 
                    id="language"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue="pt-BR"
                  >
                    <option value="pt-BR">Português do Brasil</option>
                    <option value="en-US">English (US)</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="currency">Formato de Moeda</Label>
                <div className="flex items-center space-x-2">
                  <select 
                    id="currency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue="BRL"
                  >
                    <option value="BRL">Real (R$)</option>
                    <option value="USD">Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => saveSettings('gerais')}>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Perfil de Usuário</CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" defaultValue="Administrador" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@cicloalarico.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <textarea 
                  id="bio" 
                  rows={4} 
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Escreva uma breve biografia..."
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => saveSettings('conta')}>Atualizar Perfil</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>
                Gerencie os detalhes de sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input id="company-name" defaultValue="Ciclo Alarico" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-document">CNPJ</Label>
                  <Input id="company-document" defaultValue="00.000.000/0001-00" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Telefone</Label>
                  <Input id="company-phone" defaultValue="(11) 1234-5678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email da Empresa</Label>
                  <Input id="company-email" type="email" defaultValue="contato@cicloalarico.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-address">Endereço</Label>
                <Input id="company-address" defaultValue="Rua das Bicicletas, 123" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => saveSettings('empresa')}>Salvar Informações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="profiles">
          <UserProfilesTab />
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificações</CardTitle>
              <CardDescription>
                Configure como você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações por Email</p>
                  <p className="text-sm text-muted-foreground">Receba atualizações por email</p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações no Sistema</p>
                  <p className="text-sm text-muted-foreground">Receba notificações dentro do sistema</p>
                </div>
                <Switch id="system-notifications" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alertas de Estoque</p>
                  <p className="text-sm text-muted-foreground">Receba alertas quando produtos estiverem com estoque baixo</p>
                </div>
                <Switch id="inventory-alerts" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => saveSettings('notificações')}>Salvar Preferências</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Gerencie as opções de segurança da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input id="current-password" type="password" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Autenticação de Dois Fatores</p>
                  <p className="text-sm text-muted-foreground">Aumente a segurança da sua conta</p>
                </div>
                <Switch id="two-factor" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => saveSettings('segurança')}>Atualizar Senha</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
