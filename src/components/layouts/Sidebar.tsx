
import { Link, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import {
  BarChart,
  Users,
  Package,
  ShoppingCart,
  Wrench,
  CreditCard,
  Receipt,
  Calendar as CalendarIcon,
  BarChart3,
  Settings,
  FileText,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = ({ expanded }: { expanded: boolean }) => {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();

  // Define the navigation items
  const navItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: BarChart,
    },
    {
      title: "Clientes",
      href: "/customers",
      icon: Users,
    },
    {
      title: "Produtos",
      href: "/products",
      icon: Package,
    },
    {
      title: "Estoque",
      href: "/inventory",
      icon: ShoppingCart,
    },
    {
      title: "Ordens de Serviço",
      href: "/services",
      icon: Wrench,
    },
    {
      title: "Vendas",
      href: "/sales",
      icon: ShoppingCart,
    },
    {
      title: "Financeiro",
      href: "/financial",
      icon: CreditCard,
    },
    {
      title: "Contas a Pagar",
      href: "/bills",
      icon: Receipt,
    },
    {
      title: "Agenda",
      href: "/calendar",
      icon: CalendarIcon,
    },
    {
      title: "Relatórios",
      href: "/reports",
      icon: BarChart3,
    },
    {
      title: "Usuários",
      href: "/users",
      icon: Users,
    },
    {
      title: "Configurações",
      href: "/settings",
      icon: Settings,
    },
  ];

  if (isMobile) {
    return null;
  }

  return (
    <div
      className={cn(
        "hidden md:flex flex-col border-r transition-all duration-300 bg-shop-primary text-white",
        expanded ? "w-56" : "w-16"
      )}
    >
      <div className="p-4 h-16 flex items-center border-b border-shop-dark">
        <h1
          className={cn(
            "font-bold overflow-hidden transition-all duration-300 text-white",
            expanded ? "w-56 opacity-100" : "w-0 opacity-0"
          )}
        >
          Ciclo Alarico
        </h1>
        <img
          src="/favicon.ico"
          alt="Logo"
          className={cn(
            "h-8 w-8 transition-all duration-300",
            expanded ? "opacity-0 w-0" : "opacity-100"
          )}
        />
      </div>

      <div className="py-4 flex-1">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center py-2 px-3 rounded-lg text-sm font-medium hover:bg-shop-dark",
                  isActive
                    ? "bg-shop-dark text-white"
                    : "text-white hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5")} />
                <span
                  className={cn(
                    "ml-3 whitespace-nowrap transition-all duration-300",
                    expanded ? "opacity-100" : "w-0 opacity-0"
                  )}
                >
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
