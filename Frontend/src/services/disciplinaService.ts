import { apiClient } from "./api";
import { Disciplina, PaginatedResponse } from "@types";

export const disciplinaService = {
  async obtenerDisciplinas(
    params?: any,
  ): Promise<PaginatedResponse<Disciplina>> {
    return apiClient.getPaginated<Disciplina>("/disciplina", params);
  },

  async obtenerDisciplina(id: number): Promise<Disciplina> {
    const response = await apiClient.get<Disciplina>(`/disciplina/${id}`);
    return response.data!;
  },

  async crearDisciplina(data: Partial<Disciplina>): Promise<Disciplina> {
    const response = await apiClient.post<Disciplina>("/disciplina", data);
    return response.data!;
  },

  async actualizarDisciplina(
    id: number,
    data: Partial<Disciplina>,
  ): Promise<Disciplina> {
    const response = await apiClient.put<Disciplina>(`/disciplina/${id}`, data);
    return response.data!;
  },

  async eliminarDisciplina(id: number): Promise<void> {
    await apiClient.delete(`/disciplina/${id}`);
  },
};
