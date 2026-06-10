import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CalendarDays, ShieldCheck, Users } from "lucide-react";
import { useAuthStore } from "@store/authStore";
import { Button, Input, Alert } from "@components/common";
import logoSrc from "../images/Logo color - azul (1).png";

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
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-[linear-gradient(135deg,#0f172a_0%,#075985_54%,#047857_100%)] p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-x-10 top-28 h-px bg-white/20" />
          <div className="absolute bottom-16 left-10 right-10 grid grid-cols-6 gap-3 opacity-25">
            {Array.from({ length: 36 }).map((_, index) => (
              <div key={index} className="h-16 rounded border border-white/40" />
            ))}
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <img
              src={logoSrc}
              alt="Gestión Deportiva"
              className="h-14 w-14 rounded-lg bg-white object-contain p-1 shadow-lg"
            />
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary-100">
                Universidad
              </p>
              <h1 className="text-2xl font-bold">Gestión Deportiva</h1>
            </div>
          </div>

          <div className="relative z-10 max-w-xl">
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-100">
              Torneos y reservas
            </p>
            <h2 className="mt-4 text-5xl font-bold leading-tight">
              Administra tus torneos y reservas.
            </h2>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: Users, label: "Equipos" },
                { icon: CalendarDays, label: "Reservas" },
                { icon: ShieldCheck, label: "Roles" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur"
                  >
                    <Icon size={22} />
                    <p className="mt-3 text-sm font-semibold">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-slate-50 p-4 text-gray-900 sm:p-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <img
                src={logoSrc}
                alt="Gestión Deportiva"
                className="h-12 w-12 rounded-lg object-contain"
              />
              <div>
                <h1 className="text-xl font-bold">Gestión Deportiva</h1>
                <p className="text-sm text-gray-500">Panel universitario</p>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-xl">
              <div className="mb-8">
                <p className="text-sm font-bold uppercase tracking-wide text-primary-700">
                  Acceso al sistema
                </p>
                <h2 className="mt-2 text-3xl font-bold text-gray-950">
                  Iniciar sesión
                </h2>
                <p className="mt-2 text-gray-600">
                  Ingresa con tu cuenta institucional para continuar.
                </p>
              </div>

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
                  placeholder="********"
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
                  Entrar al panel
                </Button>
              </form>

              <div className="mt-6 border-t border-gray-200 pt-6 text-center">
                <p className="text-gray-600">
                  ¿No tienes cuenta?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-primary-700 hover:text-primary-800"
                  >
                    Regístrate aquí
                  </Link>
                </p>
                <p className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-500">
                  Demo: usa credenciales de prueba del backend.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginForm;
