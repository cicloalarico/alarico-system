
import React from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart2,
  Calendar,
  ClipboardList,
  CreditCard,
  FileText,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Tool,
  Truck,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const pathName = location.pathname;

  const mainLinks = [
    {
      name: "Dashboard",
      href: "/",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      name: "Calendário",
      href: "/calendar",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      name: "Clientes",
      href: "/customers",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      name: "Produtos",
      href: "/products",
      icon: <Package className="mr-2 h-4 w-4" />,
    },
    {
      name: "Serviços",
      href: "/services",
      icon: <Tool className="mr-2 h-4 w-4" />,
    },
    {
      name: "Ordens de Serviço",
      href: "/service-orders",
      icon: <Wrench className="mr-2 h-4 w-4" />,
    },
    {
      name: "Vendas",
      href: "/sales",
      icon: <ShoppingCart className="mr-2 h-4 w-4" />,
    },
    {
      name: "Estoque",
      href: "/inventory",
      icon: <Truck className="mr-2 h-4 w-4" />,
    },
    {
      name: "Financeiro",
      href: "/financial",
      icon: <Wallet className="mr-2 h-4 w-4" />,
    },
    {
      name: "Contas",
      href: "/bills",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
    },
    {
      name: "Relatórios",
      href: "/reports",
      icon: <BarChart2 className="mr-2 h-4 w-4" />,
    },
  ];

  const secondaryLinks = [
    {
      name: "Usuários",
      href: "/users",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      name: "Configurações",
      href: "/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ];

  const NavLink = ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => {
    const isActive = pathName === href;

    return (
      <Link
        to={href}
        className={cn(
          "flex items-center rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-800",
          isActive
            ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
            : "text-gray-500 dark:text-gray-400",
          className
        )}
      >
        {children}
      </Link>
    );
  };

  return (
    <aside className="hidden lg:flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <ClipboardList className="h-6 w-6" />
          <span className="text-lg">BikeMaster</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <div className="px-4 space-y-1">
          {mainLinks.map((link) => (
            <NavLink key={link.name} href={link.href}>
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </div>
        <div className="mt-8">
          <div className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Administração
          </div>
          <div className="px-4 space-y-1">
            {secondaryLinks.map((link) => (
              <NavLink key={link.name} href={link.href}>
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
