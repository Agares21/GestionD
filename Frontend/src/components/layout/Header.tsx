import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@store/authStore";
import { Menu, LogOut, User } from "lucide-react";

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
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-primary-600">
              Gestion Deportiva
            </h1>
          </div>

          <div className="flex items-center gap-4 relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <User size={20} />
              <span className="text-sm font-medium">{usuario?.nombre}</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
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
                  Cerrar Sesion
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
