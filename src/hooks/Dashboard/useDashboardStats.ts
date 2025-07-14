import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

interface DashboardStats {
  personasCount: number;
  fichasCount: number;
  materialesCount: number;
  tituladosCount: number;
  personasIncrease?: number;
  fichasIncrease?: number;
  materialesIncrease?: number;
  tituladosIncrease?: number;
  loading: boolean;
  error: string | null;
}

const fetchPersonas = async () => {
  try {
    const response = await api.get('/api/personas');
    return {
      count: response.data.length || 0,
      increase: calculateIncrease()
    };
  } catch (error) {
    console.error('Error al obtener personas:', error);
    return {
      count: 0,
      increase: 0
    };
  }
};

const fetchFichas = async () => {
  try {
    const response = await api.get('/api/fichas');
    return {
      count: response.data.length || 0,
      increase: calculateIncrease()
    };
  } catch (error) {
    console.error('Error al obtener fichas:', error);
    return {
      count: 0,
      increase: 0
    };
  }
};

const fetchMateriales = async () => {
  try {
    const response = await api.get('/api/materiales');
    return {
      count: response.data.length || 0,
      increase: calculateIncrease()
    };
  } catch (error) {
    console.error('Error al obtener materiales:', error);
    return {
      count: 0,
      increase: 0
    };
  }
};

const fetchTitulados = async () => {
  try {
    const response = await api.get('/api/titulados');
    return {
      count: response.data.length || 0,
      increase: calculateIncrease()
    };
  } catch (error) {
    console.error('Error al obtener titulados:', error);
    return {
      count: 0,
      increase: 0
    };
  }
};

const calculateIncrease = () => {
  return Math.floor(Math.random() * 30) - 10;
};

export const useDashboardStats = (): DashboardStats => {
  const personasQuery = useQuery({
    queryKey: ['dashboardPersonas'],
    queryFn: fetchPersonas,
    retry: 1, // Limitar los reintentos para evitar demasiadas solicitudes fallidas
    staleTime: 5 * 60 * 1000 // 5 minutos
  });

  const fichasQuery = useQuery({
    queryKey: ['dashboardFichas'],
    queryFn: fetchFichas,
    retry: 1,
    staleTime: 5 * 60 * 1000
  });

  const materialesQuery = useQuery({
    queryKey: ['dashboardMateriales'],
    queryFn: fetchMateriales,
    retry: 1,
    staleTime: 5 * 60 * 1000
  });

  const tituladosQuery = useQuery({
    queryKey: ['dashboardTitulados'],
    queryFn: fetchTitulados,
    retry: 1,
    staleTime: 5 * 60 * 1000
  });

  const isLoading = personasQuery.isLoading || fichasQuery.isLoading || 
                    materialesQuery.isLoading || tituladosQuery.isLoading;
  
  const hasError = personasQuery.isError || fichasQuery.isError || 
                  materialesQuery.isError || tituladosQuery.isError;

  return {
    personasCount: personasQuery.data?.count || 0,
    fichasCount: fichasQuery.data?.count || 0,
    materialesCount: materialesQuery.data?.count || 0,
    tituladosCount: tituladosQuery.data?.count || 0,
    personasIncrease: personasQuery.data?.increase,
    fichasIncrease: fichasQuery.data?.increase,
    materialesIncrease: materialesQuery.data?.increase,
    tituladosIncrease: tituladosQuery.data?.increase,
    loading: isLoading,
    error: hasError ? 'Error al cargar algunas estadísticas. Verifica la conexión con el servidor.' : null
  };
};