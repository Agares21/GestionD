import React, { useEffect, useState } from "react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { Layout } from "@components/layout";
import { Button, Card, Input, Modal, Select, Table } from "@components/common";
import { jugadorService, personaService } from "@services/playerService";
import { equipoService } from "@services/equipoService";
import { Equipo, Persona, UserRole } from "@types";

const emptyForm = {
  nombre: "",
  apellido: "",
  carnet: "",
  email: "",
  celular: "",
  equipo_id: "",
};

const canAppearAsPlayer = (persona: Persona, equipo?: string) => {
  const roles = persona.roles || [];
  const isAdminOrDelegate = roles.some((role) =>
    [UserRole.ADMIN, UserRole.DELEGADO].includes(role),
  );
  const isPlayer = roles.includes(UserRole.JUGADOR) || Boolean(equipo && equipo !== "-");

  return isPlayer && !isAdminOrDelegate;
};

const PlayersPage: React.FC = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [equiposPorJugador, setEquiposPorJugador] = useState<Record<number, string>>(
    {},
  );

  const loadPlayers = async () => {
    setIsLoading(true);
    try {
      const [response, equiposResponse] = await Promise.all([
        personaService.obtenerPersonas(),
        equipoService.obtenerEquipos(),
      ]);

      setEquipos(equiposResponse.data);

      const relaciones = await Promise.all(
        response.data.map(async (persona) => {
          const equiposJugador = await jugadorService.obtenerEquiposPorJugador(
            persona.id,
          );
          return [persona.id, equiposJugador[0]?.nombre ?? "-"] as const;
        }),
      );
      const equiposPorPersona = Object.fromEntries(relaciones);

      setPersonas(
        response.data.filter((persona) =>
          canAppearAsPlayer(persona, equiposPorPersona[persona.id]),
        ),
      );
      setEquiposPorJugador(equiposPorPersona);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = async (persona: Persona) => {
    const equiposJugador = await jugadorService.obtenerEquiposPorJugador(persona.id);

    setEditingId(persona.id);
    setFormData({
      nombre: persona.nombre ?? "",
      apellido: persona.apellido ?? "",
      carnet: (persona as any).carnet ?? persona.cedula ?? "",
      email: persona.email ?? "",
      celular: (persona as any).celular ?? persona.telefono ?? "",
      equipo_id: equiposJugador[0]?.id ? String(equiposJugador[0].id) : "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar jugador?")) return;
    await personaService.eliminarPersona(id);
    setPersonas((current) => current.filter((persona) => persona.id !== id));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const equipoId = formData.equipo_id ? Number(formData.equipo_id) : undefined;
    const payload = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      carnet: formData.carnet,
      email: formData.email,
      celular: formData.celular,
    };

    if (editingId) {
      await personaService.actualizarPersona(editingId, payload);
      await personaService.asignarRolJugador(editingId);
      await jugadorService.asignarJugadorAEquipo(editingId, equipoId);
    } else {
      const created = await personaService.crearPersona(payload);
      await personaService.asignarRolJugador(created.id);
      await jugadorService.asignarJugadorAEquipo(created.id, equipoId);
    }

    setIsModalOpen(false);
    await loadPlayers();
  };

  const columns = [
    { key: "nombre", title: "Nombre" },
    { key: "apellido", title: "Apellido" },
    { key: "email", title: "Email" },
    { key: "celular", title: "Celular" },
    {
      key: "equipo",
      title: "Equipo",
      render: (_value: unknown, record: Persona) =>
        equiposPorJugador[record.id] ?? "-",
    },
    {
      key: "acciones",
      title: "Acciones",
      render: (_value: unknown, record: Persona) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => void openEdit(record)}>
            <Edit2 size={16} />
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(record.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Jugadores
          </h1>
          <Button variant="primary" onClick={openCreate} className="gap-2">
            <Plus size={20} />
            Nuevo Jugador
          </Button>
        </div>

        <Card>
          <Table columns={columns} data={personas} isLoading={isLoading} />
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingId ? "Editar Jugador" : "Nuevo Jugador"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
              />
              <Input
                label="Apellido"
                value={formData.apellido}
                onChange={(e) =>
                  setFormData({ ...formData, apellido: e.target.value })
                }
                required
              />
            </div>
            <Input
              label="Carnet"
              value={formData.carnet}
              onChange={(e) =>
                setFormData({ ...formData, carnet: e.target.value })
              }
              fullWidth
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              fullWidth
              required
            />
            <Input
              label="Celular"
              value={formData.celular}
              onChange={(e) =>
                setFormData({ ...formData, celular: e.target.value })
              }
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
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {editingId ? "Actualizar" : "Crear"} Jugador
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default PlayersPage;
