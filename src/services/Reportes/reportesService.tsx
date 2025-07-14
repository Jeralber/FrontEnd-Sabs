



export interface ReporteParams {
  fechaInicio: Date;
  fechaFin: Date;
  modulo: string;
}

export interface DatoReporte {
  id: string;
  nombre: string;
  fecha: string;
  [key: string]: any; 
}

export const reportesService = {
  getReporteData: async (params: ReporteParams): Promise<DatoReporte[]> => {
    try {
      const { fechaInicio, fechaFin, modulo } = params;
      
      // Formatear fechas para la API
      const inicio = fechaInicio.toISOString().split('T')[0];
      const fin = fechaFin.toISOString().split('T')[0];
      
      // Para desarrollo, si no tienes API aún, usamos datos de prueba
      console.log(`Generando datos de prueba para ${modulo} del ${inicio} al ${fin}`);
      return Array(10).fill(null).map((_, index) => ({
        id: `${modulo}-${index + 1}`,
        nombre: `${modulo.charAt(0).toUpperCase() + modulo.slice(1)} de prueba ${index + 1}`,
        fecha: new Date(
          fechaInicio.getTime() +
          Math.random() * (fechaFin.getTime() - fechaInicio.getTime())
        ).toLocaleDateString(),
      }));
      
      // Cuando tengas la API real, descomenta esto:
      /*
      const response = await axios.get(`${API_URL}/reportes/${modulo}`, {
        params: { fechaInicio: inicio, fechaFin: fin }
      });
      
      return response.data;
      */
    } catch (error) {
      console.error('Error al obtener datos para el reporte:', error);
      throw error;
    }
  }
};