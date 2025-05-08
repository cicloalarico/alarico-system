
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Layout
import MainLayout from "@/components/layouts/MainLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import ServiceOrders from "./pages/ServiceOrders";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Financial from "./pages/Financial";
import Reports from "./pages/Reports";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated (mock implementation)
    const checkAuth = () => {
      const hasAuth = localStorage.getItem("cicloAlarico_auth") === "true";
      setIsAuthenticated(hasAuth);
      setIsLoading(false);
    };

    // Simulate a short delay for authentication check
    setTimeout(checkAuth, 1000);
  }, []);

  const login = () => {
    localStorage.setItem("cicloAlarico_auth", "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("cicloAlarico_auth");
    setIsAuthenticated(false);
  };

  // Authentication loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-shop-primary border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <LoginPage onLogin={login} />
                )
              }
            />

            {/* Protected routes */}
            {isAuthenticated ? (
              <Route element={<MainLayout onLogout={logout} />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/products" element={<Products />} />
                <Route path="/services" element={<ServiceOrders />} />
                <Route path="/financial" element={<Financial />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                {/* Add more routes as needed */}
              </Route>
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
