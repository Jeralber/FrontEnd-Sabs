import { useState, useEffect, useCallback } from 'react';
import { areaService, Area } from '@/services/Areas/areaService';

export const useArea = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const fetchAreas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await areaService.getAll();
      setAreas(data);
    } catch (err) {
      setError('Error al cargar áreas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  
  const fetchAreaById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await areaService.getById(id);
      setSelectedArea(data);
      return data;
    } catch (err) {
      setError('Error al cargar el área');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);


  const createArea = useCallback(async (area: Partial<Area>) => {
    setLoading(true);
    setError(null);
    try {
      const newArea = await areaService.create(area);
      setAreas((prev) => [...prev, newArea]);
      setIsModalOpen(false);
      return newArea;
    } catch (err) {
      setError('Error al crear el área');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateArea = useCallback(async (id: number, area: Partial<Area>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedArea = await areaService.update(id, area);
      setAreas((prev) => 
        prev.map((a) => (a.idarea === id ? updatedArea : a))
      );
      setSelectedArea(null);
      setIsModalOpen(false);
      return updatedArea;
    } catch (err) {
      setError('Error al actualizar el área');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteArea = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await areaService.delete(id);
      setAreas((prev) => prev.filter((a) => a.idarea !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el área');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (values: Partial<Area>) => {
      if (selectedArea) {
        return await updateArea(selectedArea.idarea, values);
      } else {
        return await createArea(values);
      }
    },
    [selectedArea, createArea, updateArea]
  );

  const handleCreate = useCallback(() => {
    setSelectedArea(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((area: Area) => {
    setSelectedArea(area);
    setIsModalOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedArea(null);
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  return {
    areas,
    selectedArea,
    loading,
    error,
    isModalOpen,
    fetchAreas,
    fetchAreaById,
    createArea,
    updateArea,
    deleteArea,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};