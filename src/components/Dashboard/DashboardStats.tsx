import React from 'react';
import StatCard from './StatCard';
import { FaUsers, FaGraduationCap, FaBoxes, FaClipboardList } from 'react-icons/fa';

interface DashboardStatsProps {
  personasCount: number;
  fichasCount: number;
  materialesCount: number;
  tituladosCount: number;
  personasIncrease?: number;
  fichasIncrease?: number;
  materialesIncrease?: number;
  tituladosIncrease?: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  personasCount,
  fichasCount,
  materialesCount,
  tituladosCount,
  personasIncrease,
  fichasIncrease,
  materialesIncrease,
  tituladosIncrease
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Personas"
        value={personasCount}
        icon={<FaUsers size={24} />}
        color="border-blue-500"
        increase={personasIncrease}
      />
      <StatCard
        title="Total Fichas"
        value={fichasCount}
        icon={<FaClipboardList size={24} />}
        color="border-green-500"
        increase={fichasIncrease}
      />
      <StatCard
        title="Total Materiales"
        value={materialesCount}
        icon={<FaBoxes size={24} />}
        color="border-yellow-500"
        increase={materialesIncrease}
      />
      <StatCard
        title="Total Titulados"
        value={tituladosCount}
        icon={<FaGraduationCap size={24} />}
        color="border-purple-500"
        increase={tituladosIncrease}
      />
    </div>
  );
};

export default DashboardStats;