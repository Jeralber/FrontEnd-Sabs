import { useState, useEffect, useCallback } from 'react';
import { detallesService, Detalle } from '@/services/Detalles/detallesService';
import { personaService, Persona } from '@/services/Personas/personaService';
import { materialService, Material } from '@/services/Materiales/materialesServices';

export const useDetalles = () => {
  const [detalles, setDetalles] = useState<Detalle[]>([]);
  const [selectedDetalle, setSelectedDetalle] = useState<Detalle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);

  const fetchDetalles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await detallesService.getAll();
      setDetalles(data);
    } catch (err) {
      setError('Error al cargar detalles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRelatedData = useCallback(async () => {
    setLoading(true);
    try {
      const [personasData, materialesData] = await Promise.all([
        personaService.getAll(),
        materialService.getAll()
      ]);
      setPersonas(personasData);
      setMateriales(materialesData);
    } catch (err) {
      setError('Error al cargar datos relacionados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDetalleById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await detallesService.getById(id);
      setSelectedDetalle(data);
      return data;
    } catch (err) {
      setError('Error al cargar el detalle');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createDetalle = useCallback(async (detalle: Partial<Detalle>) => {
    setLoading(true);
    setError(null);
    try {
      const newDetalle = await detallesService.create(detalle);
      setDetalles((prev) => [...prev, newDetalle]);
      setIsModalOpen(false);
      return newDetalle;
    } catch (err) {
      setError('Error al crear el detalle');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDetalle = useCallback(async (id: number, detalle: Partial<Detalle>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedDetalle = await detallesService.update(id, detalle);
      setDetalles((prev) => 
        prev.map((d) => (d.iddetalle === id ? updatedDetalle : d))
      );
      setSelectedDetalle(null);
      setIsModalOpen(false);
      return updatedDetalle;
    } catch (err) {
      setError('Error al actualizar el detalle');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDetalle = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await detallesService.delete(id);
      setDetalles((prev) => prev.filter((d) => d.iddetalle !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el detalle');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (values: Partial<Detalle>) => {
      if (selectedDetalle) {
        return await updateDetalle(selectedDetalle.iddetalle, values);
      } else {
        return await createDetalle(values);
      }
    },
    [selectedDetalle, createDetalle, updateDetalle]
  );

  const handleCreate = useCallback(() => {
    setSelectedDetalle(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((detalle: Detalle) => {
    setSelectedDetalle(detalle);
    setIsModalOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedDetalle(null);
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    fetchDetalles();
    fetchRelatedData();
  }, [fetchDetalles, fetchRelatedData]);

  return {
    detalles,
    selectedDetalle,
    loading,
    error,
    isModalOpen,
    personas,
    materiales,
    fetchDetalles,
    fetchDetalleById,
    createDetalle,
    updateDetalle,
    deleteDetalle,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};