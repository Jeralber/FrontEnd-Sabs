import { useState, useEffect, useCallback } from 'react';
import { rolService, Rol } from '@/services/Roles/rolService';

export const useRol = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await rolService.getAll();
      setRoles(data);
    } catch (err) {
      setError('Error al cargar roles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRolById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await rolService.getById(id);
      setSelectedRol(data);
      return data;
    } catch (err) {
      setError('Error al cargar el rol');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRol = useCallback(async (rol: Partial<Rol>) => {
    setLoading(true);
    setError(null);
    try {
      const newRol = await rolService.create(rol);
      setRoles((prev) => [...prev, newRol]);
      setIsModalOpen(false);
      return newRol;
    } catch (err) {
      setError('Error al crear el rol');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRol = useCallback(async (id: number, rol: Partial<Rol>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedRol = await rolService.update(id, rol);
      setRoles((prev) => 
        prev.map((r) => (r.idrol === id ? updatedRol : r))
      );
      setSelectedRol(null);
      setIsModalOpen(false);
      return updatedRol;
    } catch (err) {
      setError('Error al actualizar el rol');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRol = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await rolService.delete(id);
      setRoles((prev) => prev.filter((r) => r.idrol !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el rol');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (values: Partial<Rol>) => {
      if (selectedRol) {
        return await updateRol(selectedRol.idrol, values);
      } else {
        return await createRol(values);
      }
    },
    [selectedRol, createRol, updateRol]
  );

  const handleCreate = useCallback(() => {
    setSelectedRol(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((rol: Rol) => {
    setSelectedRol(rol);
    setIsModalOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedRol(null);
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    selectedRol,
    loading,
    error,
    isModalOpen,
    fetchRoles,
    fetchRolById,
    createRol,
    updateRol,
    deleteRol,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};