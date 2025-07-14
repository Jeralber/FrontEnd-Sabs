import { useState, useEffect, useCallback } from 'react';
import { tipoMovimientoService, TipoMovimiento } from '@/services/TipoMovimientos/tipoMovimientoService';

export const useTipoMovimiento = () => {
  const [tipoMovimientos, setTipoMovimientos] = useState<TipoMovimiento[]>([]);
  const [selectedTipoMovimiento, setSelectedTipoMovimiento] = useState<TipoMovimiento | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTipoMovimientos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tipoMovimientoService.getAll();
      setTipoMovimientos(data);
    } catch (err) {
      setError('Error al cargar tipos de movimiento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTipoMovimientoById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tipoMovimientoService.getById(id);
      setSelectedTipoMovimiento(data);
      return data;
    } catch (err) {
      setError('Error al cargar el tipo de movimiento');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTipoMovimiento = useCallback(async (tipoMovimiento: Partial<TipoMovimiento>) => {
    setLoading(true);
    setError(null);
    try {
      const newTipoMovimiento = await tipoMovimientoService.create(tipoMovimiento);
      setTipoMovimientos((prev) => [...prev, newTipoMovimiento]);
      setIsModalOpen(false);
      return newTipoMovimiento;
    } catch (err) {
      setError('Error al crear el tipo de movimiento');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTipoMovimiento = useCallback(async (id: number, tipoMovimiento: Partial<TipoMovimiento>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTipoMovimiento = await tipoMovimientoService.update(id, tipoMovimiento);
      setTipoMovimientos((prev) => 
        prev.map((tm) => (tm.idtipomovimiento === id ? updatedTipoMovimiento : tm))
      );
      setSelectedTipoMovimiento(null);
      setIsModalOpen(false);
      return updatedTipoMovimiento;
    } catch (err) {
      setError('Error al actualizar el tipo de movimiento');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTipoMovimiento = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await tipoMovimientoService.delete(id);
      setTipoMovimientos((prev) => prev.filter((tm) => tm.idtipomovimiento !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el tipo de movimiento');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (values: Partial<TipoMovimiento>) => {
      if (selectedTipoMovimiento) {
        return await updateTipoMovimiento(selectedTipoMovimiento.idtipomovimiento, values);
      } else {
        return await createTipoMovimiento(values);
      }
    },
    [selectedTipoMovimiento, createTipoMovimiento, updateTipoMovimiento]
  );

  const handleCreate = useCallback(() => {
    setSelectedTipoMovimiento(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((tipoMovimiento: TipoMovimiento) => {
    setSelectedTipoMovimiento(tipoMovimiento);
    setIsModalOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedTipoMovimiento(null);
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    fetchTipoMovimientos();
  }, [fetchTipoMovimientos]);

  return {
    tipoMovimientos,
    selectedTipoMovimiento,
    loading,
    error,
    isModalOpen,
    fetchTipoMovimientos,
    fetchTipoMovimientoById,
    createTipoMovimiento,
    updateTipoMovimiento,
    deleteTipoMovimiento,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};