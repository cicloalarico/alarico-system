
import React, { useState } from "react";
import { 
  Bell, 
  Menu, 
  User, 
  LogOut, 
  Settings
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  toggleSidebar: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, onLogout }) => {
  const navigate = useNavigate();
  const [notifications] = useState(3); // Example notification count

  const handleLogout = () => {
    // Handle logout logic here
    if (onLogout) {
      onLogout();
    }
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 mr-2 rounded-md hover:bg-gray-100 lg:hidden focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-bold text-shop-primary">Ciclo Alarico</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <Bell className="h-5 w-5 text-gray-500 cursor-pointer hover:text-shop-primary" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </div>
        
        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center cursor-pointer space-x-1">
              <div className="bg-shop-primary rounded-full p-1">
                <User size={18} className="text-white" />
              </div>
              <span className="text-sm font-medium hidden md:inline">Admin</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
