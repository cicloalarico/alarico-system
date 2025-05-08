
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Users, 
  Package, 
  ShoppingCart, 
  Tool, 
  DollarSign, 
  BarChart3, 
  Settings,
  Tag,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
}

// Define the navigation items
const navigation = [
  { name: "Dashboard", to: "/", icon: Home },
  { 
    name: "Cadastros", 
    to: "#", 
    icon: Users,
    submenu: [
      { name: "Usuários", to: "/users" },
      { name: "Clientes", to: "/customers" }
    ] 
  },
  { name: "Estoque", to: "/inventory", icon: Package },
  { name: "Produtos", to: "/products", icon: Tag },
  { name: "Vendas", to: "/sales", icon: ShoppingCart },
  { name: "Ordem de Serviço", to: "/services", icon: Tool },
  { name: "Financeiro", to: "/financial", icon: DollarSign },
  { name: "Relatórios", to: "/reports", icon: BarChart3 },
  { name: "Agenda", to: "/calendar", icon: Calendar },
  { name: "Configurações", to: "/settings", icon: Settings }
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  return (
    <aside 
      className={cn(
        "bg-sidebar text-sidebar-foreground h-screen overflow-y-auto transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0 md:w-20"
      )}
    >
      <div className="p-4 flex items-center justify-center">
        <h2 className={cn(
          "text-white font-bold transition-all duration-300",
          isOpen ? "text-xl" : "text-xs md:text-sm"
        )}>
          {isOpen ? "Ciclo Alarico" : "CA"}
        </h2>
      </div>

      <nav className="mt-6">
        <ul className="space-y-1 px-2">
          {navigation.map((item) => (
            <li key={item.name}>
              {item.submenu ? (
                <div className="mb-1">
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className={cn(
                      "w-full flex items-center px-4 py-3 text-sidebar-foreground rounded-md hover:bg-sidebar-accent transition-colors",
                      openSubmenu === item.name && "bg-sidebar-accent"
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {isOpen && <span>{item.name}</span>}
                    {isOpen && (
                      <svg
                        className={`ml-auto h-4 w-4 transform ${
                          openSubmenu === item.name ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>
                  {isOpen && openSubmenu === item.name && (
                    <ul className="pl-10 mt-1 space-y-1">
                      {item.submenu.map((subitem) => (
                        <li key={subitem.name}>
                          <NavLink
                            to={subitem.to}
                            className={({ isActive }) =>
                              cn(
                                "block py-2 px-4 rounded-md hover:bg-sidebar-accent",
                                isActive && "bg-sidebar-accent font-medium"
                              )
                            }
                          >
                            {subitem.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-4 py-3 text-sidebar-foreground rounded-md hover:bg-sidebar-accent transition-colors",
                      isActive && "bg-sidebar-accent font-medium"
                    )
                  }
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {isOpen && <span>{item.name}</span>}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full p-4 bg-sidebar-accent">
        <div className={cn(
          "text-xs text-sidebar-foreground/70",
          !isOpen && "text-center"
        )}>
          {isOpen ? "© 2024 Ciclo Alarico" : "© 2024"}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
