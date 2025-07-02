import React, { useState } from 'react';
import { Card } from '@heroui/react';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import CentrosPDF from '../../components/PDFGenerator/CentrosPDF';
import CentroReportSelector from '../../components/PDFGenerator/CentroReportSelector';
import { useCentro } from '@/hooks/Centros/useCentros';
import { Centro } from '@/services/Centros/centroService';

const CentrosReportePage: React.FC = () => {
  const {
    centros,
    loading,
    error
  } = useCentro();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredCentros, setFilteredCentros] = useState<Partial<Centro>[]>([]);

  React.useEffect(() => {
    if (centros && centros.length > 0) {
      setFilteredCentros(centros);
    }
  }, [centros]);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredCentros(centros);
      return;
    }

    const filtered = centros.filter(centro => {
      if (!centro.fechacreacion) return false;
      
      const creationDate = new Date(centro.fechacreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredCentros(filtered);
  };

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reporte de Centros</h1>
      
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
          <CentroReportSelector 
            data={filteredCentros} 
            startDate={startDate} 
            endDate={endDate} 
          />
        </div>
      </Card>
      
      <Card>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Listado de Centros</h2>
            <PDFDownloader
              document={<CentrosPDF data={filteredCentros} startDate={startDate} endDate={endDate} />}
              fileName="reporte-centros"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Centro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Municipio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Actualización</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCentros.map((centro) => (
                  <tr key={centro.idcentro}>
                    <td className="px-6 py-4 whitespace-nowrap">{centro.idcentro}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{centro.centro}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{centro.municipioRelation?.municipio || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${centro.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {centro.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {centro.fechacreacion ? new Date(centro.fechacreacion).toLocaleDateString('es-ES') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {centro.fechaactualización ? new Date(centro.fechaactualización).toLocaleDateString('es-ES') : '-'}
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

export default CentrosReportePage;