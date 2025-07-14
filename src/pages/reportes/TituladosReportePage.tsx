import React, { useState } from 'react';
import { Card } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import TituladosPDF from '../../components/PDFGenerator/TituladosPDF';
import TituladoReportSelector from '../../components/PDFGenerator/TituladoReportSelector';
import { useTitulado } from '@/hooks/Titulados/useTitulados';
import { Titulado } from '@/services/Titulados/tituladoService';

const TituladosReportePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    titulados,
    loading,
    error
  } = useTitulado();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredTitulados, setFilteredTitulados] = useState<Partial<Titulado>[]>([]);

  React.useEffect(() => {
    if (titulados && titulados.length > 0) {
      setFilteredTitulados(titulados);
    }
  }, [titulados]);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredTitulados(titulados);
      return;
    }

    const filtered = titulados.filter(titulado => {
      if (!titulado.fechacreacion) return false;
      
      const creationDate = new Date(titulado.fechacreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredTitulados(filtered);
  };

  const handleBackToReports = () => {
    navigate('/reportes');
  };

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reporte de Titulados</h1>
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
          <TituladoReportSelector 
            data={filteredTitulados} 
            startDate={startDate} 
            endDate={endDate} 
          />
        </div>
      </Card>
      
      <Card>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Listado de Titulados</h2>
            <PDFDownloader
              document={<TituladosPDF data={filteredTitulados} startDate={startDate} endDate={endDate} />}
              fileName="reporte-titulados"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titulado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ficha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Actualización</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTitulados.map((titulado) => (
                  <tr key={titulado.idtitulado}>
                    <td className="px-6 py-4 whitespace-nowrap">{titulado.idtitulado}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{titulado.titulado}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{titulado.areaRelation?.area || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{titulado.fichaRelation?.numficha || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${titulado.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {titulado.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {titulado.fechacreacion ? new Date(titulado.fechacreacion).toLocaleDateString('es-ES') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {titulado.fechaactualización ? new Date(titulado.fechaactualización).toLocaleDateString('es-ES') : '-'}
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

export default TituladosReportePage;