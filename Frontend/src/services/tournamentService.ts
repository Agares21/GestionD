import { apiClient } from "./api";
import { Torneo, Partido, ResultadoPartido, PaginatedResponse } from "@types";

export const torneoService = {
  async obtenerTorneos(params?: any): Promise<PaginatedResponse<Torneo>> {
    return apiClient.getPaginated<Torneo>("/torneo", params);
  },

  async obtenerTorneo(id: number): Promise<Torneo> {
    const response = await apiClient.get<Torneo>(`/torneo/${id}`);
    return response.data!;
  },

  async crearTorneo(data: Partial<Torneo>): Promise<Torneo> {
    const response = await apiClient.post<Torneo>("/torneo", data);
    return response.data!;
  },

  async actualizarTorneo(id: number, data: Partial<Torneo>): Promise<Torneo> {
    const response = await apiClient.put<Torneo>(`/torneo/${id}`, data);
    return response.data!;
  },

  async eliminarTorneo(id: number): Promise<void> {
    await apiClient.delete(`/torneo/${id}`);
  },

  async agregarEquipoATorneo(
    torneoId: number,
    equipoId: number,
  ): Promise<void> {
    await apiClient.post(`/torneo/${torneoId}/equipo/${equipoId}`, {});
  },

  async removerEquipoDelTorneo(
    torneoId: number,
    equipoId: number,
  ): Promise<void> {
    await apiClient.delete(`/torneo/${torneoId}/equipo/${equipoId}`);
  },
};

export const partidoService = {
  async obtenerPartidos(params?: any): Promise<PaginatedResponse<Partido>> {
    return apiClient.getPaginated<Partido>("/partido", params);
  },

  async obtenerPartido(id: number): Promise<Partido> {
    const response = await apiClient.get<Partido>(`/partido/${id}`);
    return response.data!;
  },

  async crearPartido(data: Partial<Partido>): Promise<Partido> {
    const response = await apiClient.post<Partido>("/partido", data);
    return response.data!;
  },

  async actualizarPartido(
    id: number,
    data: Partial<Partido>,
  ): Promise<Partido> {
    const response = await apiClient.put<Partido>(`/partido/${id}`, data);
    return response.data!;
  },

  async registrarResultado(
    partidoId: number,
    resultado: Partial<ResultadoPartido>,
  ): Promise<ResultadoPartido> {
    const response = await apiClient.post<ResultadoPartido>(
      `/partido/${partidoId}/resultado`,
      resultado,
    );
    return response.data!;
  },

  async obtenerResultado(partidoId: number): Promise<ResultadoPartido> {
    const response = await apiClient.get<ResultadoPartido>(
      `/partido/${partidoId}/resultado`,
    );
    return response.data!;
  },

  async obtenerPartidosPorTorneo(torneoId: number): Promise<Partido[]> {
    const response = await apiClient.get<Partido[]>(
      `/torneo/${torneoId}/partidos`,
    );
    return response.data || [];
  },
};
