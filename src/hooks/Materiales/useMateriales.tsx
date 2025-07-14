import { useState, useEffect, useCallback } from 'react';
import { materialService, Material } from '@/services/Materiales/materialesServices';
import { tipoMaterialService, TipoMaterial } from '@/services/TipoMateriales/tipoMaterialService';
import { unidadMedidaService, UnidadMedida } from '@/services/UnidadMedidas/unidadMedidaService';
import { categoriaMaterialService, CategoriaMaterial } from '@/services/CategoriaMateriales/categoriaMaterialService';

export const useMaterial = () => {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [tiposMaterial, setTiposMaterial] = useState<TipoMaterial[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [categoriasMaterial, setCategoriasMaterial] = useState<CategoriaMaterial[]>([]);

  const fetchMateriales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await materialService.getAll();
      setMateriales(data);
    } catch (err) {
      setError('Error al cargar materiales');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRelatedData = useCallback(async () => {
    setLoading(true);
    try {
      const [tiposData, unidadesData, categoriasData] = await Promise.all([
        tipoMaterialService.getAll(),
        unidadMedidaService.getAll(),
        categoriaMaterialService.getAll()
      ]);
      setTiposMaterial(tiposData);
      setUnidadesMedida(unidadesData);
      setCategoriasMaterial(categoriasData);
    } catch (err) {
      setError('Error al cargar datos relacionados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMaterialById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await materialService.getById(id);
      setSelectedMaterial(data);
      return data;
    } catch (err) {
      setError('Error al cargar el material');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createMaterial = useCallback(async (material: Partial<Material>) => {
    setLoading(true);
    setError(null);
    try {
      const newMaterial = await materialService.create(material);
      setMateriales((prev) => [...prev, newMaterial]);
      setIsModalOpen(false);
      return newMaterial;
    } catch (err) {
      setError('Error al crear el material');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMaterial = useCallback(async (id: number, material: Partial<Material>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedMaterial = await materialService.update(id, material);
      setMateriales((prev) => 
        prev.map((m) => (m.idmaterial === id ? updatedMaterial : m))
      );
      setSelectedMaterial(null);
      setIsModalOpen(false);
      return updatedMaterial;
    } catch (err) {
      setError('Error al actualizar el material');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMaterial = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await materialService.delete(id);
      setMateriales((prev) => prev.filter((m) => m.idmaterial !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el material');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (values: Partial<Material>) => {
      if (selectedMaterial) {
        return await updateMaterial(selectedMaterial.idmaterial, values);
      } else {
        return await createMaterial(values);
      }
    },
    [selectedMaterial, createMaterial, updateMaterial]
  );

  const handleCreate = useCallback(() => {
    setSelectedMaterial(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((material: Material) => {
    setSelectedMaterial(material);
    setIsModalOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedMaterial(null);
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    fetchMateriales();
    fetchRelatedData();
  }, [fetchMateriales, fetchRelatedData]);

  return {
    materiales,
    selectedMaterial,
    loading,
    error,
    isModalOpen,
    tiposMaterial,
    unidadesMedida,
    categoriasMaterial,
    fetchMateriales,
    fetchMaterialById,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleCancel,
  };
};