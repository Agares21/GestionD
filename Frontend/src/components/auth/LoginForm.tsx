import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@store/authStore";
import { Button, Input, Alert } from "@components/common";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Por favor completa todos los campos");
      return;
    }

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setLocalError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          ⚽ Gestión Deportiva
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sistema de Administración de Eventos Deportivos
        </p>

        {(localError || error) && (
          <Alert
            type="error"
            message={localError || error || ""}
            onClose={() => setLocalError(null)}
            closable
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            fullWidth
            required
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            fullWidth
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isLoading}
          >
            Iniciar Sesión
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Regístrate aquí
            </Link>
          </p>
          <p className="text-center text-gray-600 text-sm border-t pt-4">
            Demo: usa credenciales de prueba del backend
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
