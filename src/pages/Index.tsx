
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard
    navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="h-8 w-8 border-4 border-shop-primary border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-xl font-medium mb-2">Carregando...</h1>
        <p className="text-gray-600">Redirecionando para o Dashboard</p>
      </div>
    </div>
  );
};

export default Index;
