import { create } from "zustand";
import { Usuario, UserRole } from "@types";
import { authService } from "@services/authService";

interface AuthState {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  setError: (error: string | null) => void;
  hasRole: (rol: UserRole | UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  usuario: authService.getStoredUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ email, password });
      set({
        usuario: response.usuario,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al iniciar sesión";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({
        usuario: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  checkAuth: () => {
    const usuario = authService.getStoredUser();
    const isAuth = authService.isAuthenticated();
    set({
      usuario,
      isAuthenticated: isAuth,
    });
  },

  setError: (error) => set({ error }),

  hasRole: (roles) => {
    const { usuario } = get();
    if (!usuario) return false;

    const rolesArray = Array.isArray(roles) ? roles : [roles];
    return rolesArray.some((role) => usuario.roles.includes(role));
  },
}));
