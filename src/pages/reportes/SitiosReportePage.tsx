import React, { useState } from 'react';
import { Card } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import SitiosPDF from '../../components/PDFGenerator/SitiosPDF';
import SitioReportSelector from '../../components/PDFGenerator/SitioReportSelector';
import { useSitio } from '@/hooks/Sitios/useSitios';
import { Sitio } from '@/services/Sitios/sitioService';

const SitiosReportePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    sitios,
    loading,
    error
  } = useSitio();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredSitios, setFilteredSitios] = useState<Partial<Sitio>[]>([]);

  React.useEffect(() => {
    if (sitios && sitios.length > 0) {
      setFilteredSitios(sitios);
    }
  }, [sitios]);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredSitios(sitios);
      return;
    }

    const filtered = sitios.filter(sitio => {
      if (!sitio.fechacreacion) return false;
      
      const creationDate = new Date(sitio.fechacreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredSitios(filtered);
  };

  const handleBackToReports = () => {
    navigate('/reportes');
  };

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reporte de Sitios</h1>
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
          <SitioReportSelector 
            data={filteredSitios} 
            startDate={startDate} 
            endDate={endDate} 
          />
        </div>
      </Card>
      
      <Card>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Listado de Sitios</h2>
            <PDFDownloader
              document={<SitiosPDF data={filteredSitios} startDate={startDate} endDate={endDate} />}
              fileName="reporte-sitios"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sitio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Sitio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Actualización</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSitios.map((sitio) => (
                  <tr key={sitio.idsitio}>
                    <td className="px-6 py-4 whitespace-nowrap">{sitio.idsitio}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sitio.sitio}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sitio.tipositionRelation?.tipositio || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sitio.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {sitio.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sitio.fechacreacion ? new Date(sitio.fechacreacion).toLocaleDateString('es-ES') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sitio.fechaactualización ? new Date(sitio.fechaactualización).toLocaleDateString('es-ES') : '-'}
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

export default SitiosReportePage;