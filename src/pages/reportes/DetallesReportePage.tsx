import React, { useState } from 'react';
import { Card } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import DetallesPDF from '../../components/PDFGenerator/DetallesPDF';
import ReportSelector from '../../components/PDFGenerator/ReportSelector';
import { useDetalles } from '@/hooks/Detalles/useDetalles';
import { Detalle } from '@/services/Detalles/detallesService';



// Función para calcular la fecha de vencimiento (30 días hábiles)
const calcularFechaVencimiento = (fechaCreacion: Date): Date => {
  const fechaVencimiento = new Date(fechaCreacion);
  let diasHabilesAgregados = 0;
  
  while (diasHabilesAgregados < 30) {
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 1);
    // Verificar si es día hábil (lunes a viernes)
    const diaSemana = fechaVencimiento.getDay();
    if (diaSemana !== 0 && diaSemana !== 6) { // 0 es domingo, 6 es sábado
      diasHabilesAgregados++;
    }
  }
  
  return fechaVencimiento;
};

const DetallesReportePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    detalles,
    loading,
    error,
    personas,
    materiales
  } = useDetalles();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredDetalles, setFilteredDetalles] = useState<Partial<Detalle>[]>([]);

  // Inicializar filteredDetalles con todos los detalles cuando se cargan
  React.useEffect(() => {
    if (detalles && detalles.length > 0) {
      setFilteredDetalles(detalles);
    }
  }, [detalles]);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredDetalles(detalles);
      return;
    }

    const filtered = detalles.filter(detalle => {
      if (!detalle.fechacreacion) return false;
      
      const creationDate = new Date(detalle.fechacreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      // Ajustar la fecha final para incluir todo el día
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredDetalles(filtered);
  };
  

  // Función para obtener el nombre del material
  const getMaterialNombre = (materialId: number) => {
    // Convertir a string para asegurar la comparación correcta
    const materialIdString = materialId;
    const material = materiales?.find(m => m.idmaterial === materialIdString);
    return material ? material.nombrematerial : 'N/A';
  };

  // Función para obtener el nombre completo de la persona
  const getPersonaNombre = (personaId: string | number) => {
    // Convertir a string para asegurar la comparación correcta
    const personaIdString = personaId;
    const persona = personas?.find(p => p.idpersona === personaIdString);
    return persona ? `${persona.nombre} ${persona.apellido}` : 'N/A';
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
        <h1 className="text-2xl font-bold">Reporte de Detalles</h1>
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
          <ReportSelector 
            data={filteredDetalles} 
            startDate={startDate} 
            endDate={endDate} 
          />
        </div>
      </Card>
      
      <Card>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Listado de Detalles</h2>
            <PDFDownloader
              document={<DetallesPDF data={filteredDetalles} startDate={startDate} endDate={endDate} />}
              fileName="reporte-detalles"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Encargado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aprobador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Actualización</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Vencimiento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado Vencimiento</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDetalles.map((detalle) => {
                  const fechaCreacion = detalle.fechacreacion ? new Date(detalle.fechacreacion) : null;
                  const fechaVencimiento = fechaCreacion ? calcularFechaVencimiento(fechaCreacion) : null;
                  const vencido = fechaCreacion ? estaVencido(fechaCreacion) : false;
                  
                  return (
                    <tr key={detalle.iddetalle}>
                      <td className="px-6 py-4 whitespace-nowrap">{detalle.iddetalle}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {detalle.material ? getMaterialNombre(detalle.material) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{detalle.cantidasolicitada}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{detalle.descripcion}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {detalle.personasolicita ? getPersonaNombre(detalle.personasolicita) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {detalle.personaencargada ? getPersonaNombre(detalle.personaencargada) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {detalle.personaaprueba ? getPersonaNombre(detalle.personaaprueba) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${detalle.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {detalle.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {fechaCreacion ? fechaCreacion.toLocaleDateString('es-ES') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {detalle.fechaactualización ? new Date(detalle.fechaactualización).toLocaleDateString('es-ES') : '-'}
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

export default DetallesReportePage;