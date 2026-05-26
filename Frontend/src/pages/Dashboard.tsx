import React, { useEffect, useState } from "react";
import { Layout } from "@components/layout";
import { useAuthStore } from "@store/authStore";
import { Card, Table } from "@components/common";
import { Users, Trophy, Calendar, BarChart3, MapPin, Clock } from "lucide-react";
import { Equipo, Partido, Reserva, UserRole } from "@types";
import { jugadorService } from "@services/playerService";
import { partidoService } from "@services/tournamentService";
import { reservaService } from "@services/fieldService";

const Dashboard: React.FC = () => {
  const { usuario } = useAuthStore();
  const [equiposJugador, setEquiposJugador] = useState<Equipo[]>([]);
  const [partidosJugador, setPartidosJugador] = useState<Partido[]>([]);
  const [reservasJugador, setReservasJugador] = useState<Reserva[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isPlayerLoading, setIsPlayerLoading] = useState(false);

  const isOnlyPlayer =
    usuario?.roles.includes(UserRole.JUGADOR) &&
    !usuario.roles.some((role) =>
      [UserRole.ADMIN, UserRole.DELEGADO, UserRole.ENTRENADOR].includes(role),
    );

  useEffect(() => {
    const loadPlayerData = async () => {
      if (!usuario || !isOnlyPlayer) return;

      setIsPlayerLoading(true);
      try {
        const equipos = await jugadorService.obtenerEquiposPorJugador(usuario.id);
        const [partidosResponse, reservasResponse] = await Promise.all([
          partidoService.obtenerPartidos(),
          reservaService.obtenerReservas(),
        ]);
        const equipoIds = new Set(equipos.map((equipo) => equipo.id));

        const partidos = partidosResponse.data.filter((partido) => {
            const localId =
              (partido as any).equipo_local_id ?? partido.equipo_local?.id;
            const visitanteId =
              (partido as any).equipo_visitante_id ?? partido.equipo_visitante?.id;

            return equipoIds.has(localId) || equipoIds.has(visitanteId);
        });
        const reservas = reservasResponse.data.filter((reserva) => {
          const equipoId = (reserva as any).equipo_id ?? reserva.equipo?.id;
          return equipoIds.has(equipoId);
        });

        setEquiposJugador(equipos);
        setPartidosJugador(partidos);
        setReservasJugador(reservas);
      } finally {
        setIsPlayerLoading(false);
      }
    };

    loadPlayerData();
  }, [usuario, isOnlyPlayer]);

  const toDateKey = (date: Date) => date.toISOString().split("T")[0];
  const selectedDateKey = toDateKey(selectedDate);
  const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  const calendarOffset = (monthStart.getDay() + 6) % 7;
  const calendarCells = Array.from(
    { length: calendarOffset + monthEnd.getDate() },
    (_, index) => {
      if (index < calendarOffset) return null;
      return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), index - calendarOffset + 1);
    },
  );
  const selectedDayMatches = partidosJugador.filter(
    (partido) => partido.fecha === selectedDateKey,
  );
  const selectedDayReservations = reservasJugador.filter(
    (reserva) => reserva.fecha === selectedDateKey,
  );
  const nextMatches = [...partidosJugador]
    .filter((partido) => !partido.fecha || partido.fecha >= selectedDateKey)
    .sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`))
    .slice(0, 5);
  const nextReservations = [...reservasJugador]
    .filter((reserva) => reserva.estado !== "cancelada" && reserva.fecha >= selectedDateKey)
    .sort((a, b) =>
      `${a.fecha} ${a.hora_inicio}`.localeCompare(`${b.fecha} ${b.hora_inicio}`),
    )
    .slice(0, 5);

  const getEventsForDate = (date: Date) => {
    const key = toDateKey(date);
    return {
      matches: partidosJugador.filter((partido) => partido.fecha === key),
      reservations: reservasJugador.filter((reserva) => reserva.fecha === key),
    };
  };

  if (isOnlyPlayer) {
    return (
      <Layout>
        <div className="space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Bienvenido, {usuario?.nombre}
            </h1>
            <p className="text-gray-600 mt-2">
              Consulta tu equipo, tus partidos y las reservas de cancha.
            </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
              {selectedDate.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mi equipo</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {equiposJugador[0]?.nombre ?? "Sin equipo"}
                  </p>
                </div>
                <Users className="text-blue-600" size={28} />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Partidos</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {partidosJugador.length}
                  </p>
                </div>
                <Trophy className="text-amber-600" size={28} />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reservas</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {reservasJugador.length}
                  </p>
                </div>
                <MapPin className="text-emerald-600" size={28} />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-6">
            <Card>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900">Calendario</h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium"
                    onClick={() =>
                      setSelectedDate(
                        new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1),
                      )
                    }
                  >
                    Anterior
                  </button>
                  <span className="min-w-36 text-center font-semibold text-gray-800 capitalize">
                    {selectedDate.toLocaleDateString("es-ES", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    type="button"
                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium"
                    onClick={() =>
                      setSelectedDate(
                        new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1),
                      )
                    }
                  >
                    Siguiente
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-500 mb-2">
                {["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"].map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarCells.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="h-24 rounded-lg bg-gray-50" />;
                  }

                  const events = getEventsForDate(date);
                  const isSelected = toDateKey(date) === selectedDateKey;

                  return (
                    <button
                      type="button"
                      key={toDateKey(date)}
                      onClick={() => setSelectedDate(date)}
                      className={`h-24 rounded-lg border p-2 text-left transition-colors ${
                        isSelected
                          ? "border-primary-600 bg-primary-50"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-sm font-bold text-gray-900">
                        {date.getDate()}
                      </span>
                      <div className="mt-2 space-y-1">
                        {events.matches.length > 0 && (
                          <span className="block rounded bg-amber-100 px-2 py-1 text-[11px] font-medium text-amber-800">
                            {events.matches.length} partido
                          </span>
                        )}
                        {events.reservations.length > 0 && (
                          <span className="block rounded bg-emerald-100 px-2 py-1 text-[11px] font-medium text-emerald-800">
                            {events.reservations.length} reserva
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Detalle del Dia
              </h2>
              <div className="space-y-4">
                {selectedDayMatches.length === 0 &&
                  selectedDayReservations.length === 0 && (
                    <p className="text-sm text-gray-500 py-8 text-center">
                      No tienes partidos ni reservas para este dia.
                    </p>
                  )}
                {selectedDayMatches.map((partido) => (
                  <div key={`match-${partido.id}`} className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-semibold text-amber-800">Partido</p>
                    <p className="font-bold text-gray-900 mt-1">
                      {partido.equipo_local?.nombre ?? "-"} vs{" "}
                      {partido.equipo_visitante?.nombre ?? "-"}
                    </p>
                    <p className="text-sm text-gray-700 mt-2 flex items-center gap-2">
                      <Clock size={16} />
                      {partido.hora || "Sin hora"}
                    </p>
                    <p className="text-sm text-gray-700 mt-1 flex items-center gap-2">
                      <MapPin size={16} />
                      {partido.cancha?.nombre || "Sin cancha"}
                    </p>
                  </div>
                ))}
                {selectedDayReservations.map((reserva) => (
                  <div key={`reservation-${reserva.id}`} className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm font-semibold text-emerald-800">
                      Cancha Reservada
                    </p>
                    <p className="font-bold text-gray-900 mt-1">
                      {reserva.cancha?.nombre ?? "Cancha"}
                    </p>
                    <p className="text-sm text-gray-700 mt-2 flex items-center gap-2">
                      <Clock size={16} />
                      {reserva.hora_inicio} - {reserva.hora_fin}
                    </p>
                    <p className="text-sm text-gray-700 mt-1 flex items-center gap-2">
                      <MapPin size={16} />
                      {reserva.cancha?.ubicacion || "Sin ubicacion"}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Proximos Partidos
              </h2>
              <Table
                columns={[
                  {
                    key: "equipo_local",
                    title: "Local",
                    render: (value: Equipo) => value?.nombre ?? "-",
                  },
                  {
                    key: "equipo_visitante",
                    title: "Visitante",
                    render: (value: Equipo) => value?.nombre ?? "-",
                  },
                  { key: "fecha", title: "Fecha" },
                  { key: "hora", title: "Hora" },
                  {
                    key: "cancha",
                    title: "Cancha",
                    render: (value: any) => value?.nombre || "Sin cancha",
                  },
                ]}
                data={nextMatches}
                isLoading={isPlayerLoading}
              />
            </Card>

            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Reservas de mi Equipo
              </h2>
              <Table
                columns={[
                  {
                    key: "cancha",
                    title: "Cancha",
                    render: (value: any) => value?.nombre ?? "-",
                  },
                  { key: "fecha", title: "Fecha" },
                  { key: "hora_inicio", title: "Inicio" },
                  { key: "hora_fin", title: "Fin" },
                  { key: "estado", title: "Estado" },
                ]}
                data={nextReservations}
                isLoading={isPlayerLoading}
              />
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

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
