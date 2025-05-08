
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Lock, User } from "lucide-react";

interface LoginFormProps {
  onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, remember: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Mock login validation
    if (!formData.email || !formData.password) {
      setError("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    // Simulate API call with setTimeout
    setTimeout(() => {
      // For demo purposes, let's say admin/admin is the only valid login
      if (formData.email === "admin@cicloalarico.com" && formData.password === "admin") {
        toast({
          title: "Login bem sucedido",
          description: "Bem-vindo ao sistema Ciclo Alarico!",
        });
        onLogin();
      } else {
        setError("E-mail ou senha inválidos.");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-muted-foreground">
            <User size={16} />
          </span>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            className="pl-9"
            autoComplete="email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          <a
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Esqueceu sua senha?
          </a>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-muted-foreground">
            <Lock size={16} />
          </span>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            className="pl-9"
            autoComplete="current-password"
          />
        </div>
      </div>

      <div className="flex items-center">
        <Checkbox
          id="remember"
          checked={formData.remember}
          onCheckedChange={handleCheckboxChange}
        />
        <Label htmlFor="remember" className="ml-2 text-sm">
          Lembrar-me
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
};

export default LoginForm;
