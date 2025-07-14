import React, { useState, useEffect } from 'react';
import { Card } from '@heroui/react';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import TipoMaterialPDF from '../../components/PDFGenerator/TipoMaterialPDF';
import { Models } from '../../types/types';

// Simulación de datos - En un caso real, esto vendría de una API
const mockTiposMaterial: Partial<Models['TipoMaterial']>[] = [
  {
    idtipomaterial: 1,
    tipo: 'Construcción',
    activo: true,
    fechacreacion: new Date('2023-01-10'),
  },
  {
    idtipomaterial: 2,
    tipo: 'Construcción',
    activo: true,
    fechacreacion: new Date('2023-01-10'),
  },
  {
    idtipomaterial: 3,
    tipo: 'Construcción',
    activo: true,
    fechacreacion: new Date('2023-01-10'),
  },
  // Más datos simulados...
];

const TipoMaterialReportePage: React.FC = () => {
  const [tiposMaterial, setTiposMaterial] = useState<Partial<Models['TipoMaterial']>[]>([]);
  const [filteredTiposMaterial, setFilteredTiposMaterial] = useState<Partial<Models['TipoMaterial']>[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulación de carga de datos - En un caso real, esto sería una llamada a API
    setTimeout(() => {
      setTiposMaterial(mockTiposMaterial);
      setFilteredTiposMaterial(mockTiposMaterial);
      setLoading(false);
    }, 500);
  }, []);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredTiposMaterial(tiposMaterial);
      return;
    }

    const filtered = tiposMaterial.filter(tipo => {
      if (!tipo.fechacreacion) return false;
      
      const creationDate = new Date(tipo.fechacreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      // Ajustar la fecha final para incluir todo el día
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredTiposMaterial(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reporte de Tipos de Material</h1>
      
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
            <h2 className="text-lg font-semibold">Listado de Tipos de Material</h2>
            <PDFDownloader
              document={<TipoMaterialPDF data={filteredTiposMaterial} startDate={startDate} endDate={endDate} />}
              fileName="reporte-tipos-material"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTiposMaterial.map((tipo) => (
                    <tr key={tipo.idtipomaterial}>
                      <td className="px-6 py-4 whitespace-nowrap">{tipo.idtipomaterial}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{tipo.tipo}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tipo.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {tipo.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tipo.fechacreacion ? new Date(tipo.fechacreacion).toLocaleDateString('es-ES') : '-'}
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

export default TipoMaterialReportePage;