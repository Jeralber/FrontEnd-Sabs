import { useState, useEffect, useCallback } from 'react';
import { unidadMedidaService, UnidadMedida } from '@/services/UnidadMedidas/unidadMedidaService';

export const useUnidadMedida = () => {
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [selectedUnidadMedida, setSelectedUnidadMedida] = useState<UnidadMedida | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUnidadesMedida = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await unidadMedidaService.getAll();
      setUnidadesMedida(data);
    } catch (err) {
      setError('Error al cargar unidades de medida');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnidadMedidaById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await unidadMedidaService.getById(id);
      setSelectedUnidadMedida(data);
      return data;
    } catch (err) {
      setError('Error al cargar la unidad de medida');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createUnidadMedida = useCallback(async (unidadMedida: Partial<UnidadMedida>) => {
    setLoading(true);
    setError(null);
    try {
      const newUnidadMedida = await unidadMedidaService.create(unidadMedida);
      setUnidadesMedida((prev) => [...prev, newUnidadMedida]);
      setIsModalOpen(false);
      return newUnidadMedida;
    } catch (err) {
      setError('Error al crear la unidad de medida');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUnidadMedida = useCallback(async (id: number, unidadMedida: Partial<UnidadMedida>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUnidadMedida = await unidadMedidaService.update(id, unidadMedida);
      setUnidadesMedida((prev) => 
        prev.map((u) => (u.idunidadmedida === id ? updatedUnidadMedida : u))
      );
      setSelectedUnidadMedida(null);
      setIsModalOpen(false);
      return updatedUnidadMedida;
    } catch (err) {
      setError('Error al actualizar la unidad de medida');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUnidadMedida = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await unidadMedidaService.delete(id);
      setUnidadesMedida((prev) => prev.filter((u) => u.idunidadmedida !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar la unidad de medida');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (values: Partial<UnidadMedida>) => {
      if (selectedUnidadMedida) {
        return await updateUnidadMedida(selectedUnidadMedida.idunidadmedida, values);
      } else {
        return await createUnidadMedida(values);
      }
    },
    [selectedUnidadMedida, createUnidadMedida, updateUnidadMedida]
  );

  const handleCreate = useCallback(() => {
    setSelectedUnidadMedida(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((unidadMedida: UnidadMedida) => {
    setSelectedUnidadMedida(unidadMedida);
    setIsModalOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedUnidadMedida(null);
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    fetchUnidadesMedida();
  }, [fetchUnidadesMedida]);

  return {
    unidadesMedida,
    selectedUnidadMedida,
    loading,
    error,
    isModalOpen,
    fetchUnidadesMedida,
    fetchUnidadMedidaById,
    createUnidadMedida,
    updateUnidadMedida,
    deleteUnidadMedida,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};