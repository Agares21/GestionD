import React from "react";
import { Layout } from "@components/layout";

const PlayersPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Jugadores
        </h1>
        <p className="text-gray-600">
          Módulo de gestión de jugadores en desarrollo
        </p>
      </div>
    </Layout>
  );
};

export default PlayersPage;
