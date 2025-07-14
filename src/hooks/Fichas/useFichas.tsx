import { useState, useEffect, useCallback } from 'react';
import { fichaService, Ficha } from '@/services/Fichas/fichaService';

export const useFicha = () => {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [selectedFicha, setSelectedFicha] = useState<Ficha | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFichas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fichaService.getAll();
      setFichas(data);
    } catch (err) {
      setError('Error al cargar fichas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFichaById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fichaService.getById(id);
      setSelectedFicha(data);
      return data;
    } catch (err) {
      setError('Error al cargar la ficha');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createFicha = useCallback(async (ficha: Partial<Ficha>) => {
    setLoading(true);
    setError(null);
    try {
      const newFicha = await fichaService.create(ficha);
      setFichas((prev) => [...prev, newFicha]);
      setIsModalOpen(false);
      return newFicha;
    } catch (err) {
      setError('Error al crear la ficha');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFicha = useCallback(async (id: number, ficha: Partial<Ficha>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedFicha = await fichaService.update(id, ficha);
      setFichas((prev) => 
        prev.map((f) => (f.idficha === id ? updatedFicha : f))
      );
      setSelectedFicha(null);
      setIsModalOpen(false);
      return updatedFicha;
    } catch (err) {
      setError('Error al actualizar la ficha');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFicha = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await fichaService.delete(id);
      setFichas((prev) => prev.filter((f) => f.idficha !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar la ficha');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (values: Partial<Ficha>) => {
      if (selectedFicha) {
        return await updateFicha(selectedFicha.idficha, values);
      } else {
        return await createFicha(values);
      }
    },
    [selectedFicha, createFicha, updateFicha]
  );

  const handleCreate = useCallback(() => {
    setSelectedFicha(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((ficha: Ficha) => {
    setSelectedFicha(ficha);
    setIsModalOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedFicha(null);
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    fetchFichas();
  }, [fetchFichas]);

  return {
    fichas,
    selectedFicha,
    loading,
    error,
    isModalOpen,
    fetchFichas,
    fetchFichaById,
    createFicha,
    updateFicha,
    deleteFicha,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};