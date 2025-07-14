import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import LoginPage from "@/pages/LoginPage";
import { AuthProvider } from "@/contexts/AuthContext";
import { PersonaManager } from "@/templates/PersonaTemplate";
import { AreaManager } from "@/templates/AreasTemplate";
import { CentroManager } from "@/templates/CentrosTemplate";
import { SedeManager } from "@/templates/SedeTemplate";
import { FichaManager } from "@/templates/FichaTemplate";
import { TituladoManager } from "@/templates/TituladoTemplate";
import { SitioManager } from "@/templates/SitiosTemplate";
import { TipoSitioManager } from "@/templates/TipoSitiosTemplate";
import { MovimientoManager } from "@/templates/MovimientosTemplate";
import { TipoMovimientoManager } from "@/templates/TipoMovimientosTemplate";
import { MaterialManager } from "@/templates/MaterialesTemplate";
import { CategoriaMaterialManager } from "@/templates/CategoriaMaterialesTemplate";
import { UnidadMedidaManager } from "@/templates/UnidadMedidasTemplate";
import { TipoMaterialManager } from "@/templates/TipoMaterialesTemplate";
import { MunicipioManager } from "./templates/MunicipiosTemplate";

import DashboardPage from "./pages/DashboardPage";
import ReportesPage from "./pages/ReportesPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DetallesTemplate } from "./templates/DetallesTemplate";

// Importar páginas de reportes
import PersonasReportePage from "./pages/reportes/PersonasReportePage";
import FichasReportePage from "./pages/reportes/FichasReportePage";
import TituladosReportePage from "./pages/reportes/TituladosReportePage";
import SedesReportePage from "./pages/reportes/SedesReportePage";
import CentrosReportePage from "./pages/reportes/CentrosReportePage";
import AreasReportePage from "./pages/reportes/AreasReportePage";
import SitiosReportePage from "./pages/reportes/SitiosReportePage";
import MovimientosReportePage from "./pages/reportes/MovimientosReportePage";
import MaterialesReportePage from "./pages/reportes/MaterialesReportePage";
import DetallesReportePage from "./pages/reportes/DetallesReportePage";
import MunicipiosReportePage from "./pages/reportes/MunicipiosReportePage";

// Crear una instancia de QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <Layout>
                <DashboardPage />
              </Layout>
            }
          />

          <Route
            path="/admin"
            element={
              <Layout>
                <div>Administrador</div>
              </Layout>
            }
          />

          <Route
            path="/reportes"
            element={
              <Layout>
                <ReportesPage />
              </Layout>
            }
          />


          <Route
            path="/reportes/personas"
            element={
              <Layout>
                <PersonasReportePage />
              </Layout>
            }
          />
          <Route
            path="/reportes/fichas"
            element={
              <Layout>
                <FichasReportePage />
              </Layout>
            }
          />
          <Route
            path="/reportes/titulados"
            element={
              <Layout>
                <TituladosReportePage />
              </Layout>
            }
          />
          <Route
            path="/reportes/sedes"
            element={
              <Layout>
                <SedesReportePage />
              </Layout>
            }
          />
          <Route
            path="/reportes/centros"
            element={
              <Layout>
                <CentrosReportePage />
              </Layout>
            }
          />
          <Route
            path="/reportes/areas"
            element={
              <Layout>
                <AreasReportePage />
              </Layout>
            }
          />
          <Route
            path="/reportes/sitios"
            element={
              <Layout>
                <SitiosReportePage />
              </Layout>
            }
          />
          <Route
            path="/reportes/movimientos"
            element={
              <Layout>
                <MovimientosReportePage />
              </Layout>
            }
          />
          <Route
            path="/reportes/materiales"
            element={
              <Layout>
                <MaterialesReportePage />
              </Layout>
            }
          />
          <Route
            path="/reportes/detalles"
            element={
              <Layout>
                <DetallesReportePage />
              </Layout>
            }
          />
          <Route
            path="/reportes/municipios"
            element={
              <Layout>
                <MunicipiosReportePage />
              </Layout>
            }
          />

          {/* Módulos principales */}
          <Route
            path="/personas"
            element={
              <Layout>
                <PersonaManager />
              </Layout>
            }
          />

          <Route
            path="/areas"
            element={
              <Layout>
                <AreaManager />
              </Layout>
            }
          />

          <Route
            path="/centros"
            element={
              <Layout>
                <CentroManager />
              </Layout>
            }
          />

          <Route
            path="/sedes"
            element={
              <Layout>
                <SedeManager />
              </Layout>
            }
          />

          <Route
            path="/fichas"
            element={
              <Layout>
                <FichaManager />
              </Layout>
            }
          />

          <Route
            path="/titulados"
            element={
              <Layout>
                <TituladoManager />
              </Layout>
            }
          />

          {/* Sitios y tipos */}
          <Route
            path="/sitios"
            element={
              <Layout>
                <SitioManager />
              </Layout>
            }
          />

          <Route
            path="/tipos-sitio"
            element={
              <Layout>
                <TipoSitioManager />
              </Layout>
            }
          />

          {/* Movimientos y tipos */}
          <Route
            path="/movimientos"
            element={
              <Layout>
                <MovimientoManager />
              </Layout>
            }
          />

          <Route
            path="/tipos-movimiento"
            element={
              <Layout>
                <TipoMovimientoManager />
              </Layout>
            }
          />

          {/* Materiales y relacionados */}
          <Route
            path="/materiales"
            element={
              <Layout>
                <MaterialManager />
              </Layout>
            }
          />

          <Route
            path="/categorias"
            element={
              <Layout>
                <CategoriaMaterialManager />
              </Layout>
            }
          />

          <Route
            path="/medidas"
            element={
              <Layout>
                <UnidadMedidaManager />
              </Layout>
            }
          />

          <Route
            path="/detalles"
            element={
              <Layout>
                <DetallesTemplate />
              </Layout>
            }
          />

          <Route
            path="/tipos-material"
            element={
              <Layout>
                <TipoMaterialManager />
              </Layout>
            }
          />
          <Route
            path="/municipios"
            element={
              <Layout>
                <MunicipioManager />
              </Layout>
            }
          />
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
