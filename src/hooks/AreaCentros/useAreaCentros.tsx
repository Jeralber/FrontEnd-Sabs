import { useState, useEffect, useCallback } from 'react';
import { areaCentroService, AreaCentro } from '@/services/AreaCentros/areaCentroService';
import { Models } from '@/types/types';


import { centroService } from '@/services/Centros/centroService';
import { areaService } from '@/services/Areas/areaService';
type Centro = Models['Centro'];
type Area = Models['Area'];

export const useAreaCentro = () => {
  const [areaCentros, setAreaCentros] = useState<AreaCentro[]>([]);
  const [selectedAreaCentro, setSelectedAreaCentro] = useState<AreaCentro | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [centros, setCentros] = useState<Centro[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  
  const fetchAreaCentros = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await areaCentroService.getAll();
      setAreaCentros(data);
    } catch (err) {
      setError('Error al cargar relaciones área-centro');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

 
  const fetchCentros = useCallback(async () => {
    try {
      const data = await centroService.getAll();
      setCentros(data);
    } catch (err) {
      console.error('Error al cargar centros:', err);

    }
  }, []);


  const fetchAreas = useCallback(async () => {
    try {
      const data = await areaService.getAll();
      setAreas(data);
    } catch (err) {
      console.error('Error al cargar áreas:', err);

    }
  }, []);


  const fetchAreaCentroById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await areaCentroService.getById(id);
      setSelectedAreaCentro(data);
      return data;
    } catch (err) {
      setError('Error al cargar la relación área-centro');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);


  const createAreaCentro = useCallback(async (areaCentro: Partial<AreaCentro>) => {
    setLoading(true);
    setError(null);
    try {
      const newAreaCentro = await areaCentroService.create(areaCentro);
      setAreaCentros((prev) => [...prev, newAreaCentro]);
      setIsModalOpen(false);
      return newAreaCentro;
    } catch (err) {
      setError('Error al crear la relación área-centro');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  
  const updateAreaCentro = useCallback(async (id: number, areaCentro: Partial<AreaCentro>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedAreaCentro = await areaCentroService.update(id, areaCentro);
      setAreaCentros((prev) => 
        prev.map((ac) => (ac.idareacentro === id ? updatedAreaCentro : ac))
      );
      setSelectedAreaCentro(null);
      setIsModalOpen(false);
      return updatedAreaCentro;
    } catch (err) {
      setError('Error al actualizar la relación área-centro');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);


  const deleteAreaCentro = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await areaCentroService.delete(id);
      setAreaCentros((prev) => prev.filter((ac) => ac.idareacentro !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar la relación área-centro');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);


  const handleSubmit = useCallback(
    async (values: Partial<AreaCentro>) => {
      if (selectedAreaCentro) {
        return await updateAreaCentro(selectedAreaCentro.idareacentro, values);
      } else {
        return await createAreaCentro(values);
      }
    },
    [selectedAreaCentro, createAreaCentro, updateAreaCentro]
  );

  const handleCreate = useCallback(() => {
    setSelectedAreaCentro(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((areaCentro: AreaCentro) => {
    setSelectedAreaCentro(areaCentro);
    setIsModalOpen(true);
  }, []);


  const handleCancel = useCallback(() => {
    setSelectedAreaCentro(null);
    setIsModalOpen(false);
  }, []);


  useEffect(() => {
    fetchAreaCentros();
    fetchCentros();
    fetchAreas();
  }, [fetchAreaCentros, fetchCentros, fetchAreas]);

  return {
    areaCentros,
    selectedAreaCentro,
    loading,
    error,
    isModalOpen,
    centros,
    areas,
    fetchAreaCentros,
    fetchAreaCentroById,
    createAreaCentro,
    updateAreaCentro,
    deleteAreaCentro,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};