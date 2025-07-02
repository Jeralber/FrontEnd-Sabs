import React, { useState } from 'react';
import { Card } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import SedesPDF from '../../components/PDFGenerator/SedesPDF';
import SedeReportSelector from '../../components/PDFGenerator/SedeReportSelector';
import { useSede } from '@/hooks/Sedes/useSedes';
import { Sede } from '@/services/Sedes/SedeService';

const SedesReportePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    sedes,
    loading,
    error
  } = useSede();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredSedes, setFilteredSedes] = useState<Partial<Sede>[]>([]);

  React.useEffect(() => {
    if (sedes && sedes.length > 0) {
      setFilteredSedes(sedes);
    }
  }, [sedes]);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredSedes(sedes);
      return;
    }

    const filtered = sedes.filter(sede => {
      if (!sede.fechacreacion) return false;
      
      const creationDate = new Date(sede.fechacreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredSedes(filtered);
  };

  const handleBackToReports = () => {
    navigate('/reportes');
  };

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reporte de Sedes</h1>
        <button
          onClick={handleBackToReports}
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
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
          <SedeReportSelector 
            data={filteredSedes} 
            startDate={startDate} 
            endDate={endDate} 
          />
        </div>
      </Card>
      
      <Card>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Listado de Sedes</h2>
            <PDFDownloader
              document={<SedesPDF data={filteredSedes} startDate={startDate} endDate={endDate} />}
              fileName="reporte-sedes"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sede</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Centro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Actualización</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSedes.map((sede) => (
                  <tr key={sede.idsede}>
                    <td className="px-6 py-4 whitespace-nowrap">{sede.idsede}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sede.sede}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sede.centroRelation?.centro || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sede.direccion}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sede.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {sede.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sede.fechacreacion ? new Date(sede.fechacreacion).toLocaleDateString('es-ES') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sede.fechaactualización ? new Date(sede.fechaactualización).toLocaleDateString('es-ES') : '-'}
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

export default SedesReportePage;