import { useState, useEffect } from 'react';
import { Persona } from '@/services/Personas/personaService';
import { personaService } from '@/services/Personas/personaService';
import { fichaService } from '@/services/Fichas/fichaService';
import { rolService } from '@/services/Roles/rolService';

export const usePersona = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fichas, setFichas] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    fetchPersonas();
    fetchFichas();
    fetchRoles();
  }, []);

  const fetchPersonas = async () => {
    try {
      setLoading(true);
      const data = await personaService.getAll();
      setPersonas(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar personas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFichas = async () => {
    try {
      const data = await fichaService.getAll();
      setFichas(data);
    } catch (err) {
      console.error('Error al cargar fichas:', err);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await rolService.getAll();
      setRoles(data);
    } catch (err) {
      console.error('Error al cargar roles:', err);
    }
  };

  const handleSubmit = async (values: Partial<Persona>) => {
    try {
      setLoading(true);
      if (selectedPersona) {
        // Update existing persona
        await personaService.update(selectedPersona.idpersona, values);
      } else {
        // Create new persona
        await personaService.create(values);
      }
      fetchPersonas();
      setIsModalOpen(false);
      setSelectedPersona(null);
      return true;
    } catch (err) {
      setError('Error al guardar persona');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedPersona(null);
    setIsModalOpen(true);
  };

  const handleEdit = (persona: Persona) => {
    setSelectedPersona(persona);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedPersona(null);
  };

  const deletePersona = async (id: number) => {
    try {
      setLoading(true);
      await personaService.delete(id);
      fetchPersonas();
    } catch (err) {
      setError('Error al eliminar persona');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    personas,
    selectedPersona,
    loading,
    error,
    isModalOpen,
    fichas,
    roles,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
    deletePersona,
  };
};