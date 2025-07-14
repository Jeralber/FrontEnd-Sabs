import { useState, useEffect, useCallback } from 'react';
import { tituladoService, Titulado } from '@/services/Titulados/tituladoService';
import { Models } from '@/types/types';

import { areaService } from '@/services/Areas/areaService';
import { fichaService } from '@/services/Fichas/fichaService';
type Area = Models['Area'];
type Ficha = Models['Ficha'];

export const useTitulado = () => {
  const [titulados, setTitulados] = useState<Titulado[]>([]);
  const [selectedTitulado, setSelectedTitulado] = useState<Titulado | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);
  const [fichas, setFichas] = useState<Ficha[]>([]);

  const fetchTitulados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tituladoService.getAll();
      setTitulados(data);
    } catch (err) {
      setError('Error al cargar titulados');
      console.error(err);
    } finally {
      setLoading(false);
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

  const fetchFichas = useCallback(async () => {
    try {
      const data = await fichaService.getAll();
      setFichas(data);
    } catch (err) {
      console.error('Error al cargar fichas:', err);
    }
  }, []);

  const fetchTituladoById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tituladoService.getById(id);
      setSelectedTitulado(data);
      return data;
    } catch (err) {
      setError('Error al cargar el titulado');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTitulado = useCallback(async (titulado: Partial<Titulado>) => {
    setLoading(true);
    setError(null);
    try {
      const newTitulado = await tituladoService.create(titulado);
      setTitulados((prev) => [...prev, newTitulado]);
      setIsModalOpen(false);
      return newTitulado;
    } catch (err) {
      setError('Error al crear el titulado');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTitulado = useCallback(async (id: number, titulado: Partial<Titulado>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTitulado = await tituladoService.update(id, titulado);
      setTitulados((prev) => 
        prev.map((t) => (t.idtitulado === id ? updatedTitulado : t))
      );
      setSelectedTitulado(null);
      setIsModalOpen(false);
      return updatedTitulado;
    } catch (err) {
      setError('Error al actualizar el titulado');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTitulado = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await tituladoService.delete(id);
      setTitulados((prev) => prev.filter((t) => t.idtitulado !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el titulado');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (values: Partial<Titulado>) => {
      if (selectedTitulado) {
        return await updateTitulado(selectedTitulado.idtitulado, values);
      } else {
        return await createTitulado(values);
      }
    },
    [selectedTitulado, createTitulado, updateTitulado]
  );

  const handleCreate = useCallback(() => {
    setSelectedTitulado(null);
    setIsModalOpen(true);
  }, []);

  // Open modal for editing an existing titulado
  const handleEdit = useCallback((titulado: Titulado) => {
    setSelectedTitulado(titulado);
    setIsModalOpen(true);
  }, []);

  // Close the modal
  const handleCancel = useCallback(() => {
    setSelectedTitulado(null);
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    fetchTitulados();
    fetchAreas();
    fetchFichas();
  }, [fetchTitulados, fetchAreas, fetchFichas]);

  return {
    titulados,
    selectedTitulado,
    loading,
    error,
    isModalOpen,
    areas,
    fichas,
    fetchTitulados,
    fetchTituladoById,
    createTitulado,
    updateTitulado,
    deleteTitulado,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};