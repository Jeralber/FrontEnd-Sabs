import { useState, useEffect, useCallback } from 'react';
import { sitioService, Sitio } from '@/services/Sitios/sitioService';
import { Models } from '@/types/types';

import { tipoSitioService } from '@/services/TipoSitios/tipoSitioService';
type TipoSitio = Models['TipoSitio'];

export const useSitio = () => {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [selectedSitio, setSelectedSitio] = useState<Sitio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoSitios, setTipoSitios] = useState<TipoSitio[]>([]);

  const fetchSitios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sitioService.getAll();
      setSitios(data);
    } catch (err) {
      setError('Error al cargar sitios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTipoSitios = useCallback(async () => {
    try {
      const data = await tipoSitioService.getAll();
      setTipoSitios(data);
    } catch (err) {
      console.error('Error al cargar tipos de sitio:', err);
      // We don't set the main error state here to avoid blocking the UI
    }
  }, []);

  const fetchSitioById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sitioService.getById(id);
      setSelectedSitio(data);
      return data;
    } catch (err) {
      setError('Error al cargar el sitio');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSitio = useCallback(async (sitio: Partial<Sitio>) => {
    setLoading(true);
    setError(null);
    try {
      const newSitio = await sitioService.create(sitio);
      setSitios((prev) => [...prev, newSitio]);
      setIsModalOpen(false);
      return newSitio;
    } catch (err) {
      setError('Error al crear el sitio');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSitio = useCallback(async (id: number, sitio: Partial<Sitio>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedSitio = await sitioService.update(id, sitio);
      setSitios((prev) => 
        prev.map((s) => (s.idsitio === id ? updatedSitio : s))
      );
      setSelectedSitio(null);
      setIsModalOpen(false);
      return updatedSitio;
    } catch (err) {
      setError('Error al actualizar el sitio');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSitio = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await sitioService.delete(id);
      setSitios((prev) => prev.filter((s) => s.idsitio !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el sitio');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (values: Partial<Sitio>) => {
      if (selectedSitio) {
        return await updateSitio(selectedSitio.idsitio, values);
      } else {
        return await createSitio(values);
      }
    },
    [selectedSitio, createSitio, updateSitio]
  );

  const handleCreate = useCallback(() => {
    setSelectedSitio(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((sitio: Sitio) => {
    setSelectedSitio(sitio);
    setIsModalOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedSitio(null);
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    fetchSitios();
    fetchTipoSitios();
  }, [fetchSitios, fetchTipoSitios]);

  return {
    sitios,
    selectedSitio,
    loading,
    error,
    isModalOpen,
    tipoSitios,
    fetchSitios,
    fetchSitioById,
    createSitio,
    updateSitio,
    deleteSitio,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};