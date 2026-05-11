import { create } from "zustand";
import { Reserva } from "@types";
import { reservaService } from "@services/fieldService";

interface ReservationState {
  reservas: Reserva[];
  reserva: Reserva | null;
  isLoading: boolean;
  error: string | null;
  obtenerReservas: (params?: any) => Promise<void>;
  obtenerReserva: (id: number) => Promise<void>;
  crearReserva: (data: Partial<Reserva>) => Promise<void>;
  actualizarReserva: (id: number, data: Partial<Reserva>) => Promise<void>;
  cancelarReserva: (id: number, motivo: string) => Promise<void>;
  obtenerDisponibilidad: (canchaId: number, fecha: string) => Promise<any[]>;
  limpiar: () => void;
  setError: (error: string | null) => void;
}

export const useReservationStore = create<ReservationState>((set) => ({
  reservas: [],
  reserva: null,
  isLoading: false,
  error: null,

  obtenerReservas: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reservaService.obtenerReservas(params);
      set({ reservas: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener reservas";
      set({ error: errorMessage, isLoading: false });
    }
  },

  obtenerReserva: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const reserva = await reservaService.obtenerReserva(id);
      set({ reserva, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener reserva";
      set({ error: errorMessage, isLoading: false });
    }
  },

  crearReserva: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await reservaService.crearReserva(data);
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al crear reserva";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  actualizarReserva: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const reserva = await reservaService.actualizarReserva(id, data);
      set({ reserva, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al actualizar reserva";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  cancelarReserva: async (id, motivo) => {
    set({ isLoading: true, error: null });
    try {
      await reservaService.cancelarReserva(id, motivo);
      set((state) => ({
        reservas: state.reservas.filter((r) => r.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al cancelar reserva";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  obtenerDisponibilidad: async (canchaId, fecha) => {
    try {
      return await reservaService.obtenerDisponibilidad(canchaId, fecha);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al obtener disponibilidad";
      set({ error: errorMessage });
      return [];
    }
  },

  limpiar: () => set({ reservas: [], reserva: null, error: null }),
  setError: (error) => set({ error }),
}));
