import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Clock, Edit2, Trash2 } from "lucide-react";
import { useReservationStore } from "@store/reservationStore";
import { Button, Card, Modal, Input, Select } from "@components/common";
import { canchaService } from "@services/fieldService";
import { equipoService } from "@services/equipoService";

const ReservationCalendar: React.FC = () => {
  const {
    reservas,
    obtenerReservas,
    crearReserva,
    actualizarReserva,
    cancelarReserva,
    eliminarReserva,
  } =
    useReservationStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [canchas, setCanchas] = useState<any[]>([]);
  const [equipos, setEquipos] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    cancha_id: "",
    equipo_id: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
  });

  useEffect(() => {
    obtenerReservas({ fecha: selectedDate.toISOString().split("T")[0] });
    cargarCanchas();
    cargarEquipos();
  }, [selectedDate, obtenerReservas]);

  const cargarCanchas = async () => {
    try {
      const response = await canchaService.obtenerCanchas();
      setCanchas(response.data);
    } catch (error) {
      console.error("Error al cargar canchas:", error);
    }
  };

  const cargarEquipos = async () => {
    try {
      const response = await equipoService.obtenerEquipos();
      setEquipos(response.data);
    } catch (error) {
      console.error("Error al cargar equipos:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        cancha_id: parseInt(formData.cancha_id),
        equipo_id: formData.equipo_id ? parseInt(formData.equipo_id) : undefined,
      };
      if (editingId) {
        await actualizarReserva(editingId, payload);
      } else {
        await crearReserva(payload);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        cancha_id: "",
        equipo_id: "",
        fecha: "",
        hora_inicio: "",
        hora_fin: "",
      });
      obtenerReservas({ fecha: selectedDate.toISOString().split("T")[0] });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData({
      cancha_id: "",
      equipo_id: "",
      fecha: selectedDate.toISOString().split("T")[0],
      hora_inicio: "",
      hora_fin: "",
    });
    setIsModalOpen(true);
  };

  const openEdit = (reserva: any) => {
    setEditingId(reserva.id);
    setFormData({
      cancha_id: String(reserva.cancha_id ?? reserva.cancha?.id ?? ""),
      equipo_id: String(reserva.equipo_id ?? reserva.equipo?.id ?? ""),
      fecha: reserva.fecha,
      hora_inicio: reserva.hora_inicio,
      hora_fin: reserva.hora_fin,
    });
    setIsModalOpen(true);
  };

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const dayReservations = reservas.filter(
    (r) => r.fecha === selectedDate.toISOString().split("T")[0],
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reserva de Canchas</h1>
        <Button
          variant="primary"
          onClick={openCreate}
          className="gap-2"
        >
          <Calendar size={20} />
          Nueva Reserva
        </Button>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <Button variant="secondary" onClick={() => handleDateChange(-1)}>
            ← Anterior
          </Button>
          <h2 className="text-2xl font-bold">
            {selectedDate.toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <Button variant="secondary" onClick={() => handleDateChange(1)}>
            Siguiente →
          </Button>
        </div>

        {/* Reservations for Selected Day */}
        <div className="space-y-4">
          {dayReservations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay reservas para este día
            </p>
          ) : (
            dayReservations.map((reserva) => (
              <div
                key={reserva.id}
                className={`p-4 border rounded-lg ${
                  reserva.estado === "confirmada"
                    ? "bg-green-50 border-green-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">
                      {reserva.cancha.nombre}
                    </h3>
                    <div className="flex gap-6 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        {reserva.cancha.ubicacion}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        {reserva.hora_inicio} - {reserva.hora_fin}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openEdit(reserva)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => eliminarReserva(reserva.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  {reserva.estado === "pendiente" && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        cancelarReserva(reserva.id, "Cancelado por usuario")
                      }
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(null);
        }}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        canchas={canchas}
        equipos={equipos}
        isEditing={Boolean(editingId)}
      />
    </div>
  );
};

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: any;
  setFormData: (data: any) => void;
  canchas: any[];
  equipos: any[];
  isEditing: boolean;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  canchas,
  equipos,
  isEditing,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar Reserva" : "Nueva Reserva"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Select
          label="Cancha"
          value={formData.cancha_id}
          onChange={(e) =>
            setFormData({ ...formData, cancha_id: e.target.value })
          }
          options={canchas.map((c) => ({ value: c.id, label: c.nombre }))}
          fullWidth
          required
        />

        <Select
          label="Equipo"
          value={formData.equipo_id}
          onChange={(e) =>
            setFormData({ ...formData, equipo_id: e.target.value })
          }
          options={equipos.map((equipo) => ({
            value: equipo.id,
            label: equipo.nombre,
          }))}
          fullWidth
        />

        <Input
          label="Fecha"
          type="date"
          value={formData.fecha}
          onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
          fullWidth
          required
        />

        <Input
          label="Hora Inicio"
          type="time"
          value={formData.hora_inicio}
          onChange={(e) =>
            setFormData({ ...formData, hora_inicio: e.target.value })
          }
          fullWidth
          required
        />

        <Input
          label="Hora Fin"
          type="time"
          value={formData.hora_fin}
          onChange={(e) =>
            setFormData({ ...formData, hora_fin: e.target.value })
          }
          fullWidth
          required
        />

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {isEditing ? "Actualizar" : "Crear"} Reserva
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReservationCalendar;
