import React, { useState } from 'react';
import { Card } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import MovimientosPDF from '../../components/PDFGenerator/MovimientosPDF';
import MovimientoReportSelector from '../../components/PDFGenerator/MovimientoReportSelector';
import { useMovimiento } from '@/hooks/Movimientos/useMovimientos';
import { Movimiento } from '@/services/Movimientos/movimientoService';

const MovimientosReportePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    movimientos,
    loading,
    error
  } = useMovimiento();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredMovimientos, setFilteredMovimientos] = useState<Partial<Movimiento>[]>([]);

  React.useEffect(() => {
    if (movimientos && movimientos.length > 0) {
      setFilteredMovimientos(movimientos);
    }
  }, [movimientos]);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredMovimientos(movimientos);
      return;
    }

    const filtered = movimientos.filter(movimiento => {
      if (!movimiento.fechacreacion) return false;
      
      const creationDate = new Date(movimiento.fechacreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredMovimientos(filtered);
  };

  const handleBackToReports = () => {
    navigate('/reportes');
  };

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reporte de Movimientos</h1>
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
          <MovimientoReportSelector 
            data={filteredMovimientos} 
            startDate={startDate} 
            endDate={endDate} 
          />
        </div>
      </Card>
      
      <Card>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Listado de Movimientos</h2>
            <PDFDownloader
              document={<MovimientosPDF data={filteredMovimientos} startDate={startDate} endDate={endDate} />}
              fileName="reporte-movimientos"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Movimiento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Persona</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Actualización</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMovimientos.map((movimiento) => (
                  <tr key={movimiento.idmovimiento}>
                    <td className="px-6 py-4 whitespace-nowrap">{movimiento.idmovimiento}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{movimiento.tipomovimientoRelation?.tipomovimiento || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {movimiento.movimientopersona 
                        ? `${movimiento.movimientopersonaRelation?.nombre || ''} ${movimiento.movimientopersonaRelation?.apellido || ''}` 
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${movimiento.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {movimiento.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {movimiento.fechacreacion ? new Date(movimiento.fechacreacion).toLocaleDateString('es-ES') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {movimiento.fechaactualización ? new Date(movimiento.fechaactualización).toLocaleDateString('es-ES') : '-'}
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

export default MovimientosReportePage;