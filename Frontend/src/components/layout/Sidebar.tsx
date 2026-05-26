import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@store/authStore";
import { UserRole } from "@types";
import {
  BarChart3,
  Briefcase,
  Calendar,
  CalendarDays,
  Home,
  Trophy,
  Users,
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
      icon: CalendarDays,
      label: "Fixture",
      href: "/fixture",
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
  ];

  const filteredMenuItems = menuItems.filter((item) => hasRole(item.roles));
  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 transform border-r border-gray-200 bg-white/95 text-gray-900 shadow-xl transition-transform backdrop-blur
          z-40 lg:relative lg:top-0 lg:h-screen lg:transform-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-4 lg:hidden flex justify-end">
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        <div className="mx-4 mt-4 rounded-lg border border-primary-100 bg-primary-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-primary-700">
            Gestión deportiva
          </p>
          <p className="mt-1 text-sm text-primary-900">
            Torneos, reservas y equipos en un solo lugar.
          </p>
        </div>

        <nav className="p-4 space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all
                  ${
                    active
                      ? "bg-primary-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"
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
