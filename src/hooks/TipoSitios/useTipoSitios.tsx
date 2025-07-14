import { useState, useEffect, useCallback } from 'react';
import { tipoSitioService, TipoSitio } from '@/services/TipoSitios/tipoSitioService';

export const useTipoSitio = () => {
  const [tipoSitios, setTipoSitios] = useState<TipoSitio[]>([]);
  const [selectedTipoSitio, setSelectedTipoSitio] = useState<TipoSitio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTipoSitios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tipoSitioService.getAll();
      setTipoSitios(data);
    } catch (err) {
      setError('Error al cargar tipos de sitio');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchTipoSitioById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tipoSitioService.getById(id);
      setSelectedTipoSitio(data);
      return data;
    } catch (err) {
      setError('Error al cargar el tipo de sitio');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTipoSitio = useCallback(async (tipoSitio: Partial<TipoSitio>) => {
    setLoading(true);
    setError(null);
    try {
      const newTipoSitio = await tipoSitioService.create(tipoSitio);
      setTipoSitios((prev) => [...prev, newTipoSitio]);
      setIsModalOpen(false);
      return newTipoSitio;
    } catch (err) {
      setError('Error al crear el tipo de sitio');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTipoSitio = useCallback(async (id: number, tipoSitio: Partial<TipoSitio>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTipoSitio = await tipoSitioService.update(id, tipoSitio);
      setTipoSitios((prev) => 
        prev.map((ts) => (ts.idtipositio === id ? updatedTipoSitio : ts))
      );
      setSelectedTipoSitio(null);
      setIsModalOpen(false);
      return updatedTipoSitio;
    } catch (err) {
      setError('Error al actualizar el tipo de sitio');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTipoSitio = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await tipoSitioService.delete(id);
      setTipoSitios((prev) => prev.filter((ts) => ts.idtipositio !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el tipo de sitio');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (values: Partial<TipoSitio>) => {
      if (selectedTipoSitio) {
        return await updateTipoSitio(selectedTipoSitio.idtipositio, values);
      } else {
        return await createTipoSitio(values);
      }
    },
    [selectedTipoSitio, createTipoSitio, updateTipoSitio]
  );

  const handleCreate = useCallback(() => {
    setSelectedTipoSitio(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((tipoSitio: TipoSitio) => {
    setSelectedTipoSitio(tipoSitio);
    setIsModalOpen(true);
  }, []);

  // Close the modal
  const handleCancel = useCallback(() => {
    setSelectedTipoSitio(null);
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    fetchTipoSitios();
  }, [fetchTipoSitios]);

  return {
    tipoSitios,
    selectedTipoSitio,
    loading,
    error,
    isModalOpen,
    fetchTipoSitios,
    fetchTipoSitioById,
    createTipoSitio,
    updateTipoSitio,
    deleteTipoSitio,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};