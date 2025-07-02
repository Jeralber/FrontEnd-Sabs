import React, { useState } from 'react';
import { Card } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import MaterialesPDF from '../../components/PDFGenerator/MaterialesPDF';
import MaterialReportSelector from '../../components/PDFGenerator/MaterialReportSelector';
import { useMaterial } from '@/hooks/Materiales/useMateriales';
import { Material } from '@/services/Materiales/materialesServices';

const MaterialesReportePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    materiales,
    loading,
    error
  } = useMaterial();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredMateriales, setFilteredMateriales] = useState<Partial<Material>[]>([]);

  React.useEffect(() => {
    if (materiales && materiales.length > 0) {
      setFilteredMateriales(materiales);
    }
  }, [materiales]);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredMateriales(materiales);
      return;
    }

    const filtered = materiales.filter(material => {
      if (!material.fechacreacion) return false;
      
      const creationDate = new Date(material.fechacreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredMateriales(filtered);
  };

  const handleBackToReports = () => {
    navigate('/reportes');
  };

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reporte de Materiales</h1>
        <button
          onClick={handleBackToReports}
          className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2"
        >
          <FaArrowLeft />
          <span>Volver al Menú de Reportes</span>
        </button>
      </div>
      
      <Card className="mb-6">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Filtrar por Fecha</h2>
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onFilter={handleFilter}
          />
        </div>
      </Card>
      
      <Card className="mb-6">
        <div className="p-4">
          <MaterialReportSelector 
            data={filteredMateriales} 
            startDate={startDate} 
            endDate={endDate} 
          />
        </div>
      </Card>
      
      <Card>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Listado de Materiales</h2>
            <PDFDownloader
              document={<MaterialesPDF data={filteredMateriales} startDate={startDate} endDate={endDate} />}
              fileName="reporte-materiales"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caduca</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMateriales.map((material) => (
                  <tr key={material.idmaterial}>
                    <td className="px-6 py-4 whitespace-nowrap">{material.idmaterial}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{material.nombrematerial}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{material.descripcion}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{material.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{material.tipomaterialRelation?.tipo|| '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{material.unidadmedidaRelation?.unidadmedida || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${material.caduca ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {material.caduca ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {material.fechacreacion ? new Date(material.fechacreacion).toLocaleDateString('es-ES') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MaterialesReportePage;