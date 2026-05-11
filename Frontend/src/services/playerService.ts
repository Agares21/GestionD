import { apiClient } from "./api";
import { Jugador, Persona, PaginatedResponse } from "@types";

export const jugadorService = {
  async obtenerJugadores(params?: any): Promise<PaginatedResponse<Jugador>> {
    return apiClient.getPaginated<Jugador>("/jugador", params);
  },

  async obtenerJugador(id: number): Promise<Jugador> {
    const response = await apiClient.get<Jugador>(`/jugador/${id}`);
    return response.data!;
  },

  async crearJugador(data: Partial<Jugador>): Promise<Jugador> {
    const response = await apiClient.post<Jugador>("/jugador", data);
    return response.data!;
  },

  async actualizarJugador(
    id: number,
    data: Partial<Jugador>,
  ): Promise<Jugador> {
    const response = await apiClient.put<Jugador>(`/jugador/${id}`, data);
    return response.data!;
  },

  async eliminarJugador(id: number): Promise<void> {
    await apiClient.delete(`/jugador/${id}`);
  },

  async obtenerJugadoresPorEquipo(equipoId: number): Promise<Jugador[]> {
    const response = await apiClient.get<Jugador[]>(
      `/jugador-equipo/equipo/${equipoId}`,
    );
    return response.data || [];
  },

  async agregarJugadorAEquipo(
    jugadorId: number,
    equipoId: number,
    numeroCamiseta: number,
    posicion: string,
  ): Promise<void> {
    await apiClient.post("/jugador-equipo", {
      jugador_id: jugadorId,
      equipo_id: equipoId,
      numero_camiseta: numeroCamiseta,
      posicion,
    });
  },
};

export const personaService = {
  async obtenerPersonas(params?: any): Promise<PaginatedResponse<Persona>> {
    return apiClient.getPaginated<Persona>("/persona", params);
  },

  async obtenerPersona(id: number): Promise<Persona> {
    const response = await apiClient.get<Persona>(`/persona/${id}`);
    return response.data!;
  },

  async crearPersona(data: Partial<Persona>): Promise<Persona> {
    const response = await apiClient.post<Persona>("/persona", data);
    return response.data!;
  },

  async actualizarPersona(
    id: number,
    data: Partial<Persona>,
  ): Promise<Persona> {
    const response = await apiClient.put<Persona>(`/persona/${id}`, data);
    return response.data!;
  },

  async eliminarPersona(id: number): Promise<void> {
    await apiClient.delete(`/persona/${id}`);
  },
};
