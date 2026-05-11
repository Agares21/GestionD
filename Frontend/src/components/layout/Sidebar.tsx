import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@store/authStore";
import { UserRole } from "@types";
import {
  Home,
  Users,
  Trophy,
  Briefcase,
  Calendar,
  Settings,
  BarChart3,
  BookOpen,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { hasRole } = useAuthStore();

  const menuItems = [
    {
      icon: Home,
      label: "Inicio",
      href: "/dashboard",
      roles: [
        UserRole.ADMIN,
        UserRole.DELEGADO,
        UserRole.ENTRENADOR,
        UserRole.JUGADOR,
      ],
    },
    {
      icon: Users,
      label: "Equipos",
      href: "/equipos",
      roles: [UserRole.ADMIN, UserRole.DELEGADO, UserRole.ENTRENADOR],
    },
    {
      icon: Users,
      label: "Jugadores",
      href: "/jugadores",
      roles: [UserRole.ADMIN, UserRole.DELEGADO, UserRole.ENTRENADOR],
    },
    {
      icon: Calendar,
      label: "Reservas de Canchas",
      href: "/reservas",
      roles: [UserRole.ADMIN, UserRole.DELEGADO, UserRole.ENTRENADOR],
    },
    {
      icon: Trophy,
      label: "Torneos",
      href: "/torneos",
      roles: [UserRole.ADMIN, UserRole.DELEGADO],
    },
    {
      icon: BarChart3,
      label: "Resultados",
      href: "/resultados",
      roles: [UserRole.ADMIN, UserRole.DELEGADO],
    },
    {
      icon: Briefcase,
      label: "Gestión de Disciplinas",
      href: "/disciplinas",
      roles: [UserRole.ADMIN],
    },
    {
      icon: BookOpen,
      label: "CMS",
      href: "/cms",
      roles: [UserRole.ADMIN],
    },
    {
      icon: BarChart3,
      label: "Panel Administrativo",
      href: "/admin",
      roles: [UserRole.ADMIN],
    },
    {
      icon: Settings,
      label: "Configuración",
      href: "/settings",
      roles: [UserRole.ADMIN],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => hasRole(item.roles));

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-900 text-white transform transition-transform
          z-40 lg:relative lg:top-0 lg:h-screen lg:transform-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-4 lg:hidden flex justify-end">
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                  ${
                    active
                      ? "bg-primary-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
