import React from "react";
import DashboardStats from "@/components/Dashboard/DashboardStats";
import { useDashboardStats } from "@/hooks/Dashboard/useDashboardStats";
import { DetallesTemplate } from "@/templates/DetallesTemplate";

const DashboardPage: React.FC = () => {
  const {
    personasCount,
    fichasCount,
    materialesCount,
    tituladosCount,
    personasIncrease,
    fichasIncrease,
    materialesIncrease,
    tituladosIncrease,
    loading,
    error,
  } = useDashboardStats();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {loading ? (
        <div className="text-center py-4">Cargando estadísticas...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      ) : (
        <DashboardStats
          personasCount={personasCount}
          fichasCount={fichasCount}
          materialesCount={materialesCount}
          tituladosCount={tituladosCount}
          personasIncrease={personasIncrease}
          fichasIncrease={fichasIncrease}
          materialesIncrease={materialesIncrease}
          tituladosIncrease={tituladosIncrease}
        />
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Movimientos Recientes
        </h2>
        <DetallesTemplate />
      </div>
    </div>
  );
};

export default DashboardPage;
