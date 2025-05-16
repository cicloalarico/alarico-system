
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import MainLayout from "@/components/layouts/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Calendar from "@/pages/Calendar";
import Customers from "@/pages/Customers";
import Products from "@/pages/Products";
import ServiceOrders from "@/pages/ServiceOrders";
import Sales from "@/pages/Sales";
import Inventory from "@/pages/Inventory";
import Financial from "@/pages/Financial";
import Bills from "@/pages/Bills";
import Reports from "@/pages/Reports";
import Users from "@/pages/Users";
import Settings from "@/pages/Settings";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";
import Services from "@/pages/Services";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="customers" element={<Customers />} />
          <Route path="products" element={<Products />} />
          <Route path="services" element={<Services />} />
          <Route path="service-orders" element={<ServiceOrders />} />
          <Route path="sales" element={<Sales />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="financial" element={<Financial />} />
          <Route path="bills" element={<Bills />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
