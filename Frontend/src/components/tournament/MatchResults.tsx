import React, { useEffect, useState } from "react";
import { Partido } from "@types";
import { useTournamentStore } from "@store/tournamentStore";
import { Button, Input, Modal, Card, Table } from "@components/common";
import { Plus } from "lucide-react";

const MatchResultsList: React.FC = () => {
  const { partidos, isLoading, obtenerPartidos, registrarResultado } =
    useTournamentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Partido | null>(null);

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
      render: (_, record: Partido) => (
        <Button
          size="sm"
          variant={record.estado === "finalizado" ? "secondary" : "primary"}
          onClick={() => {
            setSelectedMatch(record);
            setIsModalOpen(true);
          }}
        >
          {record.estado === "finalizado"
            ? "Ver Resultado"
            : "Registrar Resultado"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Resultados de Partidos
        </h1>
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
    </div>
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
