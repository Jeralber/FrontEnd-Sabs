import { useState, useEffect, useCallback } from 'react';
import { municipioService, Municipio } from '@/services/Municipios/municipioService';

export const useMunicipio = () => {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [selectedMunicipio, setSelectedMunicipio] = useState<Municipio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMunicipios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await municipioService.getAll();
      setMunicipios(data);
    } catch (err) {
      setError('Error al cargar municipios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMunicipioById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await municipioService.getById(id);
      setSelectedMunicipio(data);
      return data;
    } catch (err) {
      setError('Error al cargar el municipio');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createMunicipio = useCallback(async (municipio: Partial<Municipio>) => {
    setLoading(true);
    setError(null);
    try {
      const newMunicipio = await municipioService.create(municipio);
      setMunicipios((prev) => [...prev, newMunicipio]);
      setIsModalOpen(false);
      return newMunicipio;
    } catch (err) {
      setError('Error al crear el municipio');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMunicipio = useCallback(async (id: number, municipio: Partial<Municipio>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedMunicipio = await municipioService.update(id, municipio);
      setMunicipios((prev) => 
        prev.map((m) => (m.idmunicipio === id ? updatedMunicipio : m))
      );
      setSelectedMunicipio(null);
      setIsModalOpen(false);
      return updatedMunicipio;
    } catch (err) {
      setError('Error al actualizar el municipio');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMunicipio = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await municipioService.delete(id);
      setMunicipios((prev) => prev.filter((m) => m.idmunicipio !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el municipio');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (values: Partial<Municipio>) => {
      if (selectedMunicipio) {
        return await updateMunicipio(selectedMunicipio.idmunicipio, values);
      } else {
        return await createMunicipio(values);
      }
    },
    [selectedMunicipio, createMunicipio, updateMunicipio]
  );

  const handleCreate = useCallback(() => {
    setSelectedMunicipio(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((municipio: Municipio) => {
    setSelectedMunicipio(municipio);
    setIsModalOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedMunicipio(null);
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    fetchMunicipios();
  }, [fetchMunicipios]);

  return {
    municipios,
    selectedMunicipio,
    loading,
    error,
    isModalOpen,
    fetchMunicipios,
    fetchMunicipioById,
    createMunicipio,
    updateMunicipio,
    deleteMunicipio,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};