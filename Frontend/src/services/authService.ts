import { apiClient } from "./api";
import { LoginCredentials, AuthResponse, Usuario } from "@types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials,
    );
    if (response.data) {
      apiClient.setToken(response.data.access_token);
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
    }
    return response.data!;
  },

  async logout(): Promise<void> {
    apiClient.clearToken();
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  },

  async getCurrentUser(): Promise<Usuario> {
    const response = await apiClient.get<Usuario>("/auth/profile");
    return response.data!;
  },

  getStoredUser(): Usuario | null {
    const stored = localStorage.getItem("usuario");
    return stored ? JSON.parse(stored) : null;
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },
};
