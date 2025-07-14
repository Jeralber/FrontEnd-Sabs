import React, { useState, useEffect } from 'react';
import { Card } from '@heroui/react';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import UnidadMedidaPDF from '../../components/PDFGenerator/UnidadMedidaPDF';
import { Models } from '../../types/types';

// Simulación de datos - En un caso real, esto vendría de una API
const mockUnidadesMedida: Partial<Models['UnidadMedida']>[] = [
 
  // Más datos simulados...
];

const UnidadesMedidaReportePage: React.FC = () => {
  const [unidadesMedida, setUnidadesMedida] = useState<Partial<Models['UnidadMedida']>[]>([]);
  const [filteredUnidadesMedida, setFilteredUnidadesMedida] = useState<Partial<Models['UnidadMedida']>[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulación de carga de datos - En un caso real, esto sería una llamada a API
    setTimeout(() => {
      setUnidadesMedida(mockUnidadesMedida);
      setFilteredUnidadesMedida(mockUnidadesMedida);
      setLoading(false);
    }, 500);
  }, []);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredUnidadesMedida(unidadesMedida);
      return;
    }

    const filtered = unidadesMedida.filter(unidad => {
      if (!unidad.fechacreacion) return false;
      
      const creationDate = new Date(unidad.fechacreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      // Ajustar la fecha final para incluir todo el día
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredUnidadesMedida(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reporte de Unidades de Medida</h1>
      
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
            <h2 className="text-lg font-semibold">Listado de Unidades de Medida</h2>
            <PDFDownloader
              document={<UnidadMedidaPDF data={filteredUnidadesMedida} startDate={startDate} endDate={endDate} />}
              fileName="reporte-unidades-medida"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad de Medida</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUnidadesMedida.map((unidad) => (
                    <tr key={unidad.idunidadmedida}>
                      <td className="px-6 py-4 whitespace-nowrap">{unidad.idunidadmedida}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{unidad.unidadmedida}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${unidad.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {unidad.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {unidad.fechacreacion ? new Date(unidad.fechacreacion).toLocaleDateString('es-ES') : '-'}
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

export default UnidadesMedidaReportePage;