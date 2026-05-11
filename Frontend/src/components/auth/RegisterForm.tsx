import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@store/authStore";
import { Button, Input, Alert } from "@components/common";

interface RegisterFormData {
  nombre: string;
  apellido: string;
  carnet: string;
  email: string;
  celular: string;
  password: string;
  passwordConfirm: string;
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading } = useAuthStore();
  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: "",
    apellido: "",
    carnet: "",
    email: "",
    celular: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.carnet ||
      !formData.email ||
      !formData.celular ||
      !formData.password ||
      !formData.passwordConfirm
    ) {
      setError("Por favor completa todos los campos");
      return false;
    }

    if (!formData.email.includes("@ucb.edu.bo")) {
      setError("El email debe ser del dominio @ucb.edu.bo");
      return false;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("Las contraseñas no coinciden");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          carnet: formData.carnet,
          email: formData.email,
          celular: formData.celular,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrarse");
      }

      setSuccess("¡Registro exitoso! Redirigiendo al login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error al registrarse");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          ⚽ Registro
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Crear nueva cuenta como Jugador
        </p>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
            closable
          />
        )}

        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess(null)}
            closable
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nombre"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Juan"
              required
            />

            <Input
              label="Apellido"
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Pérez"
              required
            />
          </div>

          <Input
            label="Carnet"
            type="text"
            name="carnet"
            value={formData.carnet}
            onChange={handleChange}
            placeholder="12345678"
            fullWidth
            required
          />

          <Input
            label="Email (UCB)"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="juan@ucb.edu.bo"
            fullWidth
            required
          />

          <Input
            label="Celular"
            type="tel"
            name="celular"
            value={formData.celular}
            onChange={handleChange}
            placeholder="76543210"
            fullWidth
            required
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            fullWidth
            required
          />

          <Input
            label="Confirmar Contraseña"
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
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
            Registrarse como Jugador
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
