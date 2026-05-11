import React, { useEffect, useState } from "react";
import { useTournamentStore } from "@store/tournamentStore";
import { Button, Input, Select, Modal, Card, Table } from "@components/common";
import { Torneo } from "@types";
import { Plus, Edit2, Trash2 } from "lucide-react";

const TournamentList: React.FC = () => {
  const { torneos, isLoading, obtenerTorneos, eliminarTorneo } =
    useTournamentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    obtenerTorneos();
  }, [obtenerTorneos]);

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este torneo?")) {
      try {
        await eliminarTorneo(id);
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const columns = [
    {
      key: "nombre",
      title: "Nombre del Torneo",
    },
    {
      key: "estado",
      title: "Estado",
      render: (value: string) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            value === "en_curso"
              ? "bg-blue-100 text-blue-800"
              : value === "finalizado"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {value.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "cantidad_rondas",
      title: "Rondas",
    },
    {
      key: "acciones",
      title: "Acciones",
      render: (_, record: Torneo) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setEditingId(record.id)}
          >
            <Edit2 size={16} />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(record.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Torneos</h1>
        <Button
          variant="primary"
          onClick={() => {
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="gap-2"
        >
          <Plus size={20} />
          Nuevo Torneo
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={torneos} isLoading={isLoading} />
      </Card>

      <TournamentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingId={editingId}
      />
    </div>
  );
};

interface TournamentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingId?: number | null;
}

const TournamentFormModal: React.FC<TournamentFormModalProps> = ({
  isOpen,
  onClose,
  editingId,
}) => {
  const { crearTorneo, actualizarTorneo, torneo } = useTournamentStore();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("planeado");

  useEffect(() => {
    if (editingId && torneo) {
      setNombre(torneo.nombre);
      setDescripcion(torneo.descripcion);
      setEstado(torneo.estado);
    } else {
      setNombre("");
      setDescripcion("");
      setEstado("planeado");
    }
  }, [editingId, torneo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await actualizarTorneo(editingId, { nombre, descripcion, estado });
      } else {
        await crearTorneo({ nombre, descripcion, estado });
      }
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingId ? "Editar Torneo" : "Nuevo Torneo"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del Torneo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
          required
        />

        <Input
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          fullWidth
          as="textarea"
        />

        <Select
          label="Estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          options={[
            { value: "planeado", label: "Planeado" },
            { value: "en_curso", label: "En Curso" },
            { value: "finalizado", label: "Finalizado" },
          ]}
          fullWidth
        />

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {editingId ? "Actualizar" : "Crear"} Torneo
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TournamentList;
