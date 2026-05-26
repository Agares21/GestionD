import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "@store/authStore";
import { UserRole } from "@types";
import { ProtectedRoute } from "@components/auth";
import {
  LoginPage,
  RegisterPage,
  Dashboard,
  TeamsPage,
  PlayersPage,
  ReservationsPage,
  TournamentsPage,
  ResultsPage,
  AdminPage,
  CMSPage,
  DisciplinesPage,
  SettingsPage,
  ProfilePage,
  NotFoundPage,
} from "@pages/index";

const App: React.FC = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/equipos"
          element={
            <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.DELEGADO]}>
              <TeamsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jugadores"
          element={
            <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.DELEGADO]}>
              <PlayersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reservas"
          element={
            <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.DELEGADO]}>
              <ReservationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/torneos"
          element={
            <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.DELEGADO]}>
              <TournamentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resultados"
          element={
            <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.DELEGADO]}>
              <ResultsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/disciplinas"
          element={
            <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
              <DisciplinesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cms"
          element={
            <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
              <CMSPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
