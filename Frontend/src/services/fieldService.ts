import { apiClient } from "./api";
import { Cancha, Reserva, PaginatedResponse } from "@types";

export const canchaService = {
  async obtenerCanchas(params?: any): Promise<PaginatedResponse<Cancha>> {
    return apiClient.getPaginated<Cancha>("/cancha", params);
  },

  async obtenerCancha(id: number): Promise<Cancha> {
    const response = await apiClient.get<Cancha>(`/cancha/${id}`);
    return response.data!;
  },

  async crearCancha(data: Partial<Cancha>): Promise<Cancha> {
    const response = await apiClient.post<Cancha>("/cancha", data);
    return response.data!;
  },

  async actualizarCancha(id: number, data: Partial<Cancha>): Promise<Cancha> {
    const response = await apiClient.put<Cancha>(`/cancha/${id}`, data);
    return response.data!;
  },

  async eliminarCancha(id: number): Promise<void> {
    await apiClient.delete(`/cancha/${id}`);
  },
};

export const reservaService = {
  async obtenerReservas(params?: any): Promise<PaginatedResponse<Reserva>> {
    return apiClient.getPaginated<Reserva>("/reserva", params);
  },

  async obtenerReserva(id: number): Promise<Reserva> {
    const response = await apiClient.get<Reserva>(`/reserva/${id}`);
    return response.data!;
  },

  async crearReserva(data: Partial<Reserva>): Promise<Reserva> {
    const response = await apiClient.post<Reserva>("/reserva", data);
    return response.data!;
  },

  async actualizarReserva(
    id: number,
    data: Partial<Reserva>,
  ): Promise<Reserva> {
    const response = await apiClient.put<Reserva>(`/reserva/${id}`, data);
    return response.data!;
  },

  async cancelarReserva(id: number, motivo: string): Promise<void> {
    await apiClient.patch(`/reserva/${id}`, {
      estado: "cancelada",
      observaciones: motivo,
    });
  },

  async obtenerDisponibilidad(canchaId: number, fecha: string): Promise<any[]> {
    const response = await apiClient.get<any[]>(
      `/reserva/disponibilidad/${canchaId}/${fecha}`,
    );
    return response.data || [];
  },
};
