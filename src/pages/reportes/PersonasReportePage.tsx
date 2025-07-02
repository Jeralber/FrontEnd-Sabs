import React, { useState } from 'react';
import { Card } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import DateRangeFilter from '../../components/DateRangeFilter';
import PDFDownloader from '../../components/PDFGenerator/PDFDownloader';
import PersonasPDF from '../../components/PDFGenerator/PersonasPDF';
import PersonaReportSelector from '../../components/PDFGenerator/PersonaReportSelector';
import { usePersona } from '@/hooks/Personas/usePersonas';
import { Persona } from '@/services/Personas/personaService';

const PersonasReportePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    personas,
    loading,
    error
  } = usePersona();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredPersonas, setFilteredPersonas] = useState<Partial<Persona>[]>([]);

  React.useEffect(() => {
    if (personas && personas.length > 0) {
      setFilteredPersonas(personas);
    }
  }, [personas]);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredPersonas(personas);
      return;
    }

    const filtered = personas.filter(persona => {
      if (!persona.fechacreacion) return false;
      
      const creationDate = new Date(persona.fechacreacion);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      end.setHours(23, 59, 59, 999);
      
      return creationDate >= start && creationDate <= end;
    });
    
    setFilteredPersonas(filtered);
  };

  const handleBackToReports = () => {
    navigate('/reportes');
  };

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reporte de Personas</h1>
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
          <PersonaReportSelector 
            data={filteredPersonas} 
            startDate={startDate} 
            endDate={endDate} 
          />
        </div>
      </Card>
      
      <Card>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Listado de Personas</h2>
            <PDFDownloader
              document={<PersonasPDF data={filteredPersonas} startDate={startDate} endDate={endDate} />}
              fileName="reporte-personas"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identificación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPersonas.map((persona) => (
                  <tr key={persona.idpersona}>
                    <td className="px-6 py-4 whitespace-nowrap">{persona.idpersona}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{persona.identificacion}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{persona.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{persona.apellido}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{persona.correo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{persona.telefono}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${persona.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {persona.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {persona.fechacreacion ? new Date(persona.fechacreacion).toLocaleDateString('es-ES') : '-'}
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

export default PersonasReportePage;