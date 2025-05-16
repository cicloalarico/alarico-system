
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-shop-light to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/0d7e44c9-6548-42c7-a314-dc8e3f7eb0c3.png" 
              alt="Ciclo Alarico Logo" 
              className="h-24"
            />
          </div>
          <h1 className="text-2xl font-bold text-shop-dark mb-1">
            Ciclo Alarico
          </h1>
          <p className="text-gray-500">Sistema de Gestão para Bicicletarias</p>
        </div>

        <Card className="border shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold text-center">
              Acesse sua conta
            </h2>
          </CardHeader>
          <CardContent>
            <LoginForm onLogin={onLogin} />
          </CardContent>
        </Card>
        
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>
            Use admin@cicloalarico.com / admin para testar o sistema
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
