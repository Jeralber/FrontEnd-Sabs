import React, { useState, useEffect } from 'react';
import { Card } from '@heroui/react';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import TipoSitioPDF from '../../components/PDFGenerator/TipoSitioPDF';
import { Models } from '../../types/types';

// Simulación de datos - En un caso real, esto vendría de una API
const mockTiposSitio: Partial<Models['TipoSitio']>[] = [
  
  // Más datos simulados...
];

const TiposSitioReportePage: React.FC = () => {
  const [tiposSitio, setTiposSitio] = useState<Partial<Models['TipoSitio']>[]>([]);
  const [filteredTiposSitio, setFilteredTiposSitio] = useState<Partial<Models['TipoSitio']>[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulación de carga de datos - En un caso real, esto sería una llamada a API
    setTimeout(() => {
      setTiposSitio(mockTiposSitio);
      setFilteredTiposSitio(mockTiposSitio);
      setLoading(false);
    }, 500);
  }, []);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredTiposSitio(tiposSitio);
      return;
    }

    const filtered = tiposSitio.filter(tipoSitio => {
      if (!tipoSitio.fechacreacion) return false;
      
      const creationDate = new Date(tipoSitio.fechacreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      // Ajustar la fecha final para incluir todo el día
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredTiposSitio(filtered);
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reporte de Tipos de Sitio</h1>
      
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
      
      <Card>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Listado de Tipos de Sitio</h2>
            <PDFDownloader
              document={<TipoSitioPDF data={filteredTiposSitio} startDate={startDate} endDate={endDate} />}
              fileName="reporte-tipos-sitio"
            />
          </div>
          
          {loading ? (
            <p>Cargando datos...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Sitio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTiposSitio.map((tipoSitio) => (
                    <tr key={tipoSitio.idtipositio}>
                      <td className="px-6 py-4 whitespace-nowrap">{tipoSitio.idtipositio}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{tipoSitio.tipositio}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tipoSitio.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {tipoSitio.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tipoSitio.fechacreacion ? new Date(tipoSitio.fechacreacion).toLocaleDateString('es-ES') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TiposSitioReportePage;