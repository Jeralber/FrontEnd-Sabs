import { useState, useEffect, useCallback } from 'react';
import { centroService, Centro } from '@/services/Centros/centroService';
import { Models } from '@/types/types';

import { municipioService } from '@/services/Municipios/municipioService';
type Municipio = Models['Municipio'];

export const useCentro = () => {
  const [centros, setCentros] = useState<Centro[]>([]);
  const [selectedCentro, setSelectedCentro] = useState<Centro | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  const fetchCentros = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await centroService.getAll();
      setCentros(data);
    } catch (err) {
      setError('Error al cargar centros');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMunicipios = useCallback(async () => {
    try {
      const data = await municipioService.getAll();
      setMunicipios(data);
    } catch (err) {
      console.error('Error al cargar municipios:', err);
    }
  }, []);

  const fetchCentroById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await centroService.getById(id);
      setSelectedCentro(data);
      return data;
    } catch (err) {
      setError('Error al cargar el centro');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCentro = useCallback(async (centro: Partial<Centro>) => {
    setLoading(true);
    setError(null);
    try {
      const newCentro = await centroService.create(centro);
      setCentros((prev) => [...prev, newCentro]);
      setIsModalOpen(false);
      return newCentro;
    } catch (err) {
      setError('Error al crear el centro');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCentro = useCallback(async (id: number, centro: Partial<Centro>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCentro = await centroService.update(id, centro);
      setCentros((prev) => 
        prev.map((c) => (c.idcentro === id ? updatedCentro : c))
      );
      setSelectedCentro(null);
      setIsModalOpen(false);
      return updatedCentro;
    } catch (err) {
      setError('Error al actualizar el centro');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCentro = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await centroService.delete(id);
      setCentros((prev) => prev.filter((c) => c.idcentro !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el centro');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (values: Partial<Centro>) => {
      if (selectedCentro) {
        return await updateCentro(selectedCentro.idcentro, values);
      } else {
        return await createCentro(values);
      }
    },
    [selectedCentro, createCentro, updateCentro]
  );

  const handleCreate = useCallback(() => {
    setSelectedCentro(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((centro: Centro) => {
    setSelectedCentro(centro);
    setIsModalOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedCentro(null);
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    fetchCentros();
    fetchMunicipios();
  }, [fetchCentros, fetchMunicipios]);

  return {
    centros,
    selectedCentro,
    loading,
    error,
    isModalOpen,
    municipios,
    fetchCentros,
    fetchCentroById,
    createCentro,
    updateCentro,
    deleteCentro,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};