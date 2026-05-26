import React, { useEffect, useState } from "react";
import { Partido } from "@types";
import { useTournamentStore } from "@store/tournamentStore";
import { Button, Input, Modal, Card, Table, Select } from "@components/common";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { equipoService } from "@services/equipoService";
import { torneoService } from "@services/tournamentService";

const MatchResultsList: React.FC = () => {
  const {
    partidos,
    isLoading,
    obtenerPartidos,
    registrarResultado,
    crearPartido,
    actualizarPartido,
    eliminarPartido,
  } =
    useTournamentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFixtureModalOpen, setIsFixtureModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Partido | null>(null);
  const [editingFixture, setEditingFixture] = useState<Partido | null>(null);

  useEffect(() => {
    obtenerPartidos();
  }, [obtenerPartidos]);

  const columns = [
    {
      key: "equipo_local",
      title: "Equipo Local",
      render: (value: any) => value?.nombre || "-",
    },
    {
      key: "equipo_visitante",
      title: "Equipo Visitante",
      render: (value: any) => value?.nombre || "-",
    },
    {
      key: "fecha",
      title: "Fecha",
    },
    {
      key: "estado",
      title: "Estado",
      render: (value: string) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            value === "finalizado"
              ? "bg-green-100 text-green-800"
              : value === "en_curso"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "acciones",
      title: "Acciones",
      render: (_value: unknown, record: Partido) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={record.estado === "finalizado" ? "secondary" : "primary"}
            onClick={() => {
              setSelectedMatch(record);
              setIsModalOpen(true);
            }}
          >
            {record.estado === "finalizado" ? "Resultado" : "Registrar"}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setEditingFixture(record);
              setIsFixtureModalOpen(true);
            }}
          >
            <Edit2 size={16} />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              if (window.confirm("¿Eliminar partido?")) {
                eliminarPartido(record.id);
              }
            }}
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
        <h1 className="text-3xl font-bold text-gray-900">
          Resultados de Partidos
        </h1>
        <Button
          variant="primary"
          className="gap-2"
          onClick={() => {
            setEditingFixture(null);
            setIsFixtureModalOpen(true);
          }}
        >
          <Plus size={20} />
          Nuevo Partido
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={partidos} isLoading={isLoading} />
      </Card>

      <ResultadoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMatch(null);
        }}
        partido={selectedMatch}
        onSubmit={async (datos) => {
          if (selectedMatch) {
            await registrarResultado(selectedMatch.id, datos);
            setIsModalOpen(false);
            obtenerPartidos();
          }
        }}
      />

      <FixtureModal
        isOpen={isFixtureModalOpen}
        onClose={() => {
          setIsFixtureModalOpen(false);
          setEditingFixture(null);
        }}
        partido={editingFixture}
        onSubmit={async (data) => {
          if (editingFixture) {
            await actualizarPartido(editingFixture.id, data);
          } else {
            await crearPartido(data);
          }
          setIsFixtureModalOpen(false);
          setEditingFixture(null);
        }}
      />
    </div>
  );
};

interface FixtureModalProps {
  isOpen: boolean;
  onClose: () => void;
  partido: Partido | null;
  onSubmit: (data: any) => Promise<void>;
}

const FixtureModal: React.FC<FixtureModalProps> = ({
  isOpen,
  onClose,
  partido,
  onSubmit,
}) => {
  const [torneos, setTorneos] = useState<any[]>([]);
  const [equipos, setEquipos] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    torneo_id: "",
    ronda: "1",
    equipo_local_id: "",
    equipo_visitante_id: "",
    fecha: "",
    hora: "",
    estadio: "",
  });

  useEffect(() => {
    const loadOptions = async () => {
      const [torneosResponse, equiposResponse] = await Promise.all([
        torneoService.obtenerTorneos(),
        equipoService.obtenerEquipos(),
      ]);
      setTorneos(torneosResponse.data);
      setEquipos(equiposResponse.data);
    };

    if (isOpen) {
      loadOptions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (partido) {
      setFormData({
        torneo_id: String((partido as any).torneo_id ?? partido.torneo?.id ?? ""),
        ronda: String((partido as any).ronda ?? "1"),
        equipo_local_id: String(
          (partido as any).equipo_local_id ?? partido.equipo_local?.id ?? "",
        ),
        equipo_visitante_id: String(
          (partido as any).equipo_visitante_id ?? partido.equipo_visitante?.id ?? "",
        ),
        fecha: partido.fecha ?? "",
        hora: partido.hora ?? "",
        estadio: partido.cancha?.nombre ?? (partido as any).estadio ?? "",
      });
    } else {
      setFormData({
        torneo_id: "",
        ronda: "1",
        equipo_local_id: "",
        equipo_visitante_id: "",
        fecha: "",
        hora: "",
        estadio: "",
      });
    }
  }, [partido, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      torneo_id: Number(formData.torneo_id),
      ronda: Number(formData.ronda),
      equipo_local_id: formData.equipo_local_id
        ? Number(formData.equipo_local_id)
        : undefined,
      equipo_visitante_id: formData.equipo_visitante_id
        ? Number(formData.equipo_visitante_id)
        : undefined,
      fecha: formData.fecha,
      hora: formData.hora,
      estadio: formData.estadio,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={partido ? "Editar Partido" : "Nuevo Partido"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Torneo"
          value={formData.torneo_id}
          onChange={(e) => setFormData({ ...formData, torneo_id: e.target.value })}
          options={torneos.map((torneo) => ({
            value: torneo.id,
            label: torneo.nombre,
          }))}
          fullWidth
          required
        />
        <Input
          label="Ronda"
          type="number"
          value={formData.ronda}
          onChange={(e) => setFormData({ ...formData, ronda: e.target.value })}
          fullWidth
          required
          min={1}
        />
        <Select
          label="Equipo Local"
          value={formData.equipo_local_id}
          onChange={(e) =>
            setFormData({ ...formData, equipo_local_id: e.target.value })
          }
          options={equipos.map((equipo) => ({
            value: equipo.id,
            label: equipo.nombre,
          }))}
          fullWidth
        />
        <Select
          label="Equipo Visitante"
          value={formData.equipo_visitante_id}
          onChange={(e) =>
            setFormData({ ...formData, equipo_visitante_id: e.target.value })
          }
          options={equipos.map((equipo) => ({
            value: equipo.id,
            label: equipo.nombre,
          }))}
          fullWidth
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fecha"
            type="date"
            value={formData.fecha}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            required
          />
          <Input
            label="Hora"
            type="time"
            value={formData.hora}
            onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
          />
        </div>
        <Input
          label="Estadio"
          value={formData.estadio}
          onChange={(e) => setFormData({ ...formData, estadio: e.target.value })}
          fullWidth
        />
        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {partido ? "Actualizar" : "Crear"} Partido
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface ResultadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  partido: Partido | null;
  onSubmit: (datos: any) => Promise<void>;
}

const ResultadoModal: React.FC<ResultadoModalProps> = ({
  isOpen,
  onClose,
  partido,
  onSubmit,
}) => {
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);
  const [tarjetasAmarillasLocal, setTarjetasAmarillasLocal] = useState(0);
  const [tarjetasAmarillasVisitante, setTarjetasAmarillasVisitante] =
    useState(0);
  const [tarjetasRojasLocal, setTarjetasRojasLocal] = useState(0);
  const [tarjetasRojasVisitante, setTarjetasRojasVisitante] = useState(0);
  const [observaciones, setObservaciones] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({
        goles_local: golesLocal,
        goles_visitante: golesVisitante,
        tarjetas_amarillas_local: tarjetasAmarillasLocal,
        tarjetas_amarillas_visitante: tarjetasAmarillasVisitante,
        tarjetas_rojas_local: tarjetasRojasLocal,
        tarjetas_rojas_visitante: tarjetasRojasVisitante,
        observaciones,
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Resultado">
      {partido && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-6">
            <p className="text-lg font-bold">
              {partido.equipo_local?.nombre} vs{" "}
              {partido.equipo_visitante?.nombre}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={`Goles - ${partido.equipo_local?.nombre}`}
              type="number"
              value={golesLocal}
              onChange={(e) => setGolesLocal(parseInt(e.target.value))}
              min={0}
            />
            <Input
              label={`Goles - ${partido.equipo_visitante?.nombre}`}
              type="number"
              value={golesVisitante}
              onChange={(e) => setGolesVisitante(parseInt(e.target.value))}
              min={0}
            />

            <Input
              label={`Tarjetas Amarillas - ${partido.equipo_local?.nombre}`}
              type="number"
              value={tarjetasAmarillasLocal}
              onChange={(e) =>
                setTarjetasAmarillasLocal(parseInt(e.target.value))
              }
              min={0}
            />
            <Input
              label={`Tarjetas Amarillas - ${partido.equipo_visitante?.nombre}`}
              type="number"
              value={tarjetasAmarillasVisitante}
              onChange={(e) =>
                setTarjetasAmarillasVisitante(parseInt(e.target.value))
              }
              min={0}
            />

            <Input
              label={`Tarjetas Rojas - ${partido.equipo_local?.nombre}`}
              type="number"
              value={tarjetasRojasLocal}
              onChange={(e) => setTarjetasRojasLocal(parseInt(e.target.value))}
              min={0}
            />
            <Input
              label={`Tarjetas Rojas - ${partido.equipo_visitante?.nombre}`}
              type="number"
              value={tarjetasRojasVisitante}
              onChange={(e) =>
                setTarjetasRojasVisitante(parseInt(e.target.value))
              }
              min={0}
            />
          </div>

          <Input
            label="Observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            fullWidth
            as="textarea"
          />

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" isLoading={isLoading}>
              Guardar Resultado
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default MatchResultsList;
