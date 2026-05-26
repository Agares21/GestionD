import React, { useEffect, useState } from "react";
import { useEquipoStore } from "@store/equipoStore";
import { Button, Input, Select, Modal, Card, Table } from "@components/common";
import { Equipo } from "@types";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { carreraService, disciplinaService } from "@services/disciplinaService";

const EquipoList: React.FC = () => {
  const { equipos, isLoading, obtenerEquipos, obtenerEquipo, eliminarEquipo } =
    useEquipoStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    obtenerEquipos();
  }, [obtenerEquipos]);

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este equipo?")) {
      try {
        await eliminarEquipo(id);
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const columns = [
    {
      key: "nombre",
      title: "Nombre del Equipo",
    },
    {
      key: "categoria",
      title: "Categoría",
    },
    {
      key: "estado",
      title: "Estado",
      render: (value: string) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            value === "confirmado"
              ? "bg-green-100 text-green-800"
              : value === "registrado"
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "cantidad_jugadores",
      title: "Jugadores",
    },
    {
      key: "acciones",
      title: "Acciones",
      render: (_value: unknown, record: Equipo) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={async () => {
              await obtenerEquipo(record.id);
              setEditingId(record.id);
              setIsModalOpen(true);
            }}
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
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Equipos</h1>
        <Button
          variant="primary"
          onClick={() => {
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="gap-2"
        >
          <Plus size={20} />
          Nuevo Equipo
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={equipos} isLoading={isLoading} />
      </Card>

      <EquipoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingId={editingId}
      />
    </div>
  );
};

interface EquipoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingId?: number | null;
}

const EquipoFormModal: React.FC<EquipoFormModalProps> = ({
  isOpen,
  onClose,
  editingId,
}) => {
  const { crearEquipo, actualizarEquipo, equipo } = useEquipoStore();
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [carreraId, setCarreraId] = useState("");
  const [disciplinaId, setDisciplinaId] = useState("");
  const [carreras, setCarreras] = useState<Array<{ id: number; nombre: string }>>(
    [],
  );
  const [disciplinas, setDisciplinas] = useState<
    Array<{ id: number; nombre: string }>
  >([]);

  useEffect(() => {
    const loadOptions = async () => {
      const [carrerasResponse, disciplinasResponse] = await Promise.all([
        carreraService.obtenerCarreras(),
        disciplinaService.obtenerDisciplinas(),
      ]);
      setCarreras(carrerasResponse.data);
      setDisciplinas(disciplinasResponse.data);
    };

    if (isOpen) {
      loadOptions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingId && equipo) {
      setNombre(equipo.nombre);
      setCategoria(equipo.categoria);
      setCarreraId(String((equipo as any).carrera_id ?? ""));
      setDisciplinaId(String((equipo as any).disciplina_id ?? ""));
    } else {
      setNombre("");
      setCategoria("");
      setCarreraId("");
      setDisciplinaId("");
    }
  }, [editingId, equipo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await actualizarEquipo(editingId, {
          nombre,
          categoria,
          carrera_id: Number(carreraId),
          disciplina_id: Number(disciplinaId),
        } as Partial<Equipo>);
      } else {
        await crearEquipo({
          nombre,
          categoria,
          carrera_id: Number(carreraId),
          disciplina_id: Number(disciplinaId),
        } as Partial<Equipo>);
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
      title={editingId ? "Editar Equipo" : "Nuevo Equipo"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del Equipo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
          required
        />

        <Input
          label="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          fullWidth
          required
        />

        <Select
          label="Carrera"
          value={carreraId}
          onChange={(e) => setCarreraId(e.target.value)}
          options={carreras.map((carrera) => ({
            value: carrera.id,
            label: carrera.nombre,
          }))}
          fullWidth
          required
        />

        <Select
          label="Disciplina"
          value={disciplinaId}
          onChange={(e) => setDisciplinaId(e.target.value)}
          options={disciplinas.map((disciplina) => ({
            value: disciplina.id,
            label: disciplina.nombre,
          }))}
          fullWidth
          required
        />

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {editingId ? "Actualizar" : "Crear"} Equipo
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EquipoList;
