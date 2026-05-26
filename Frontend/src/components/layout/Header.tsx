import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@store/authStore";
import { LogOut, Menu, User } from "lucide-react";
import logoSrc from "../images/Logo color - azul (1).png";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { usuario, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const goToProfile = () => {
    setShowDropdown(false);
    navigate("/perfil");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 shadow-sm backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-3">
              <img
                src={logoSrc}
                alt="Gestión Deportiva"
                className="h-11 w-11 rounded-lg object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-950">
                  Gestión Deportiva
                </h1>
                <p className="hidden text-xs font-medium text-gray-500 sm:block">
                  Panel universitario
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm transition-colors hover:bg-gray-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                <User size={18} />
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold text-gray-900">
                  {usuario?.nombre}
                </span>
                <span className="block text-xs text-gray-500">
                  {usuario?.roles?.[0] ?? "Usuario"}
                </span>
              </span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-xl z-50">
                <button
                  onClick={goToProfile}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <User size={16} />
                  Mi Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
