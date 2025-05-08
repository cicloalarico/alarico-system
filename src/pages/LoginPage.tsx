
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
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <svg 
                viewBox="0 0 24 24" 
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 15a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0 0V9a2 2 0 0 0-2-2h-1M5 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 0V9a2 2 0 0 1 2-2h1m3 0H9m0 0-2 7M9 7l2 7m0 0 2-7m0 0h2" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-shop-primary mb-1">
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
