import React from "react";
import { Layout } from "@components/layout";
import { useAuthStore } from "@store/authStore";
import { Card } from "@components/common";
import { Users, Trophy, Calendar, BarChart3 } from "lucide-react";

const Dashboard: React.FC = () => {
  const { usuario, hasRole } = useAuthStore();

  const stats = [
    {
      label: "Equipos Registrados",
      value: "12",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Torneos Activos",
      value: "3",
      icon: Trophy,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Reservas Este Mes",
      value: "24",
      icon: Calendar,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Partidos Jugados",
      value: "45",
      icon: BarChart3,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Bienvenido, {usuario?.nombre}
          </h1>
          <p className="text-gray-600 mt-2">
            Panel de administración de eventos deportivos
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} hoverable>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Actividad Reciente
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  Nuevo equipo registrado
                </p>
                <p className="text-sm text-gray-600">
                  Hace 2 horas - Academia Central
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Trophy size={20} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  Torneo Intercarreras iniciado
                </p>
                <p className="text-sm text-gray-600">
                  Hace 5 horas - Participan 8 equipos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Calendar size={20} className="text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  Reserva de cancha confirmada
                </p>
                <p className="text-sm text-gray-600">
                  Hace 1 día - Cancha Principal, Mañana 15:00
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
