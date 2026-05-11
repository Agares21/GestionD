import { apiClient } from "./api";
import {
  Academia,
  Pago,
  Comunicado,
  HistorialClub,
  PaginatedResponse,
} from "@types";

export const academiaService = {
  async obtenerAcademias(params?: any): Promise<PaginatedResponse<Academia>> {
    return apiClient.getPaginated<Academia>("/academia", params);
  },

  async obtenerAcademia(id: number): Promise<Academia> {
    const response = await apiClient.get<Academia>(`/academia/${id}`);
    return response.data!;
  },

  async crearAcademia(data: Partial<Academia>): Promise<Academia> {
    const response = await apiClient.post<Academia>("/academia", data);
    return response.data!;
  },

  async actualizarAcademia(
    id: number,
    data: Partial<Academia>,
  ): Promise<Academia> {
    const response = await apiClient.put<Academia>(`/academia/${id}`, data);
    return response.data!;
  },

  async eliminarAcademia(id: number): Promise<void> {
    await apiClient.delete(`/academia/${id}`);
  },
};

export const pagoService = {
  async obtenerPagos(params?: any): Promise<PaginatedResponse<Pago>> {
    return apiClient.getPaginated<Pago>("/pago", params);
  },

  async obtenerPago(id: number): Promise<Pago> {
    const response = await apiClient.get<Pago>(`/pago/${id}`);
    return response.data!;
  },

  async crearPago(data: Partial<Pago>): Promise<Pago> {
    const response = await apiClient.post<Pago>("/pago", data);
    return response.data!;
  },

  async registrarPago(id: number, fecha: string): Promise<Pago> {
    const response = await apiClient.patch<Pago>(`/pago/${id}`, {
      estado: "pagado",
      fecha_pago: fecha,
    });
    return response.data!;
  },

  async obtenerPagosPorAcademia(academiaId: number): Promise<Pago[]> {
    const response = await apiClient.get<Pago[]>(
      `/academia/${academiaId}/pagos`,
    );
    return response.data || [];
  },
};

export const comunicadoService = {
  async obtenerComunicados(
    params?: any,
  ): Promise<PaginatedResponse<Comunicado>> {
    return apiClient.getPaginated<Comunicado>("/comunicado", params);
  },

  async obtenerComunicado(id: number): Promise<Comunicado> {
    const response = await apiClient.get<Comunicado>(`/comunicado/${id}`);
    return response.data!;
  },

  async crearComunicado(data: Partial<Comunicado>): Promise<Comunicado> {
    const response = await apiClient.post<Comunicado>("/comunicado", data);
    return response.data!;
  },

  async actualizarComunicado(
    id: number,
    data: Partial<Comunicado>,
  ): Promise<Comunicado> {
    const response = await apiClient.put<Comunicado>(`/comunicado/${id}`, data);
    return response.data!;
  },

  async eliminarComunicado(id: number): Promise<void> {
    await apiClient.delete(`/comunicado/${id}`);
  },

  async publicarComunicado(id: number): Promise<Comunicado> {
    const response = await apiClient.patch<Comunicado>(`/comunicado/${id}`, {
      estado: "publicado",
    });
    return response.data!;
  },
};

export const historialService = {
  async obtenerHistorial(
    params?: any,
  ): Promise<PaginatedResponse<HistorialClub>> {
    return apiClient.getPaginated<HistorialClub>("/historial", params);
  },

  async crearRegistroHistorial(
    data: Partial<HistorialClub>,
  ): Promise<HistorialClub> {
    const response = await apiClient.post<HistorialClub>("/historial", data);
    return response.data!;
  },
};
