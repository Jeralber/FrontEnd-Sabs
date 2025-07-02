import React, { useState } from 'react';
import { Card } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import AreasPDF from '../../components/PDFGenerator/AreasPDF';
import AreaReportSelector from '../../components/PDFGenerator/AreaReportSelector';
import { useArea } from '@/hooks/Areas/useAreas';
import { Area } from '@/services/Areas/areaService';

// Función para calcular la fecha de vencimiento (30 días hábiles)
const calcularFechaVencimiento = (fechaCreacion: Date): Date => {
  const fechaVencimiento = new Date(fechaCreacion);
  let diasHabilesAgregados = 0;
  
  while (diasHabilesAgregados < 30) {
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 1);
    // Verificar si es día hábil (lunes a viernes)
    const diaSemana = fechaVencimiento.getDay();
    if (diaSemana !== 0 && diaSemana !== 6) { 
      diasHabilesAgregados++;
    }
  }
  
  return fechaVencimiento;
};

const AreasReportePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    areas,
    loading,
    error
  } = useArea();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredAreas, setFilteredAreas] = useState<Partial<Area>[]>([]);

  React.useEffect(() => {
    if (areas && areas.length > 0) {
      setFilteredAreas(areas);
    }
  }, [areas]);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredAreas(areas);
      return;
    }

    const filtered = areas.filter(area => {
      if (!area.fechacreacion) return false;
      
      const creationDate = new Date(area.fechacreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredAreas(filtered);
  };

  // Función para verificar si un registro está vencido
  const estaVencido = (fechaCreacion: Date): boolean => {
    const fechaVencimiento = calcularFechaVencimiento(fechaCreacion);
    const hoy = new Date();
    return hoy > fechaVencimiento;
  };

  const handleBackToReports = () => {
    navigate('/reportes');
  };

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reporte de Áreas</h1>
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
          <AreaReportSelector 
            data={filteredAreas} 
            startDate={startDate} 
            endDate={endDate} 
          />
        </div>
      </Card>
      
      <Card>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Listado de Áreas</h2>
            <PDFDownloader
              document={<AreasPDF data={filteredAreas} startDate={startDate} endDate={endDate} />}
              fileName="reporte-areas"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Actualización</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Vencimiento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado Vencimiento</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAreas.map((area) => {
                  const fechaCreacion = area.fechacreacion ? new Date(area.fechacreacion) : null;
                  const fechaVencimiento = fechaCreacion ? calcularFechaVencimiento(fechaCreacion) : null;
                  const vencido = fechaCreacion ? estaVencido(fechaCreacion) : false;
                  
                  return (
                    <tr key={area.idarea}>
                      <td className="px-6 py-4 whitespace-nowrap">{area.idarea}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{area.area}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${area.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {area.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {fechaCreacion ? fechaCreacion.toLocaleDateString('es-ES') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {area.fechaactualización ? new Date(area.fechaactualización).toLocaleDateString('es-ES') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {fechaVencimiento ? fechaVencimiento.toLocaleDateString('es-ES') : '-'}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${vencido ? 'text-red-600 font-semibold' : 'text-green-600'}`}>
                        {vencido ? 'Vencido' : 'Vigente'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AreasReportePage;