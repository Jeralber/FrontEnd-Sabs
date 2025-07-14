import { useState, useEffect, useCallback } from 'react';
import { tipoMaterialService, TipoMaterial } from '@/services/TipoMateriales/tipoMaterialService';

export const useTipoMaterial = () => {
  const [tiposMaterial, setTiposMaterial] = useState<TipoMaterial[]>([]);
  const [selectedTipoMaterial, setSelectedTipoMaterial] = useState<TipoMaterial | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all tipos de material
  const fetchTiposMaterial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tipoMaterialService.getAll();
      setTiposMaterial(data);
    } catch (err) {
      setError('Error al cargar tipos de material');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTipoMaterialById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tipoMaterialService.getById(id);
      setSelectedTipoMaterial(data);
      return data;
    } catch (err) {
      setError('Error al cargar el tipo de material');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTipoMaterial = useCallback(async (tipoMaterial: Partial<TipoMaterial>) => {
    setLoading(true);
    setError(null);
    try {
      const newTipoMaterial = await tipoMaterialService.create(tipoMaterial);
      setTiposMaterial((prev) => [...prev, newTipoMaterial]);
      setIsModalOpen(false);
      return newTipoMaterial;
    } catch (err) {
      setError('Error al crear el tipo de material');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTipoMaterial = useCallback(async (id: number, tipoMaterial: Partial<TipoMaterial>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTipoMaterial = await tipoMaterialService.update(id, tipoMaterial);
      setTiposMaterial((prev) => 
        prev.map((t) => (t.idtipomaterial === id ? updatedTipoMaterial : t))
      );
      setSelectedTipoMaterial(null);
      setIsModalOpen(false);
      return updatedTipoMaterial;
    } catch (err) {
      setError('Error al actualizar el tipo de material');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTipoMaterial = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await tipoMaterialService.delete(id);
      setTiposMaterial((prev) => prev.filter((t) => t.idtipomaterial !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el tipo de material');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (values: Partial<TipoMaterial>) => {
      if (selectedTipoMaterial) {
        return await updateTipoMaterial(selectedTipoMaterial.idtipomaterial, values);
      } else {
        return await createTipoMaterial(values);
      }
    },
    [selectedTipoMaterial, createTipoMaterial, updateTipoMaterial]
  );

  const handleCreate = useCallback(() => {
    setSelectedTipoMaterial(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((tipoMaterial: TipoMaterial) => {
    setSelectedTipoMaterial(tipoMaterial);
    setIsModalOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedTipoMaterial(null);
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    fetchTiposMaterial();
  }, [fetchTiposMaterial]);

  return {
    tiposMaterial,
    selectedTipoMaterial,
    loading,
    error,
    isModalOpen,
    fetchTiposMaterial,
    fetchTipoMaterialById,
    createTipoMaterial,
    updateTipoMaterial,
    deleteTipoMaterial,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};