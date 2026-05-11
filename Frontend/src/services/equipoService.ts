import { apiClient } from "./api";
import { Equipo, PaginatedResponse } from "@types";

export const equipoService = {
  async obtenerEquipos(params?: any): Promise<PaginatedResponse<Equipo>> {
    return apiClient.getPaginated<Equipo>("/equipo", params);
  },

  async obtenerEquipo(id: number): Promise<Equipo> {
    const response = await apiClient.get<Equipo>(`/equipo/${id}`);
    return response.data!;
  },

  async crearEquipo(data: Partial<Equipo>): Promise<Equipo> {
    const response = await apiClient.post<Equipo>("/equipo", data);
    return response.data!;
  },

  async actualizarEquipo(id: number, data: Partial<Equipo>): Promise<Equipo> {
    const response = await apiClient.put<Equipo>(`/equipo/${id}`, data);
    return response.data!;
  },

  async eliminarEquipo(id: number): Promise<void> {
    await apiClient.delete(`/equipo/${id}`);
  },

  async obtenerEquiposPorAcademia(academiaId: number): Promise<Equipo[]> {
    const response = await apiClient.get<Equipo[]>(
      `/equipo/academia/${academiaId}`,
    );
    return response.data || [];
  },
};
