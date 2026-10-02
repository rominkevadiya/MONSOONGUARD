
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DemoProvider } from './context/DemoContext';
import { LanguageProvider } from './i18n';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { LocationSelection } from './pages/farmer/LocationSelection';
import { SowingDecision } from './pages/farmer/SowingDecision';
import { AdvisoryPage } from './pages/farmer/AdvisoryPage';
import { AnalysisPage } from './pages/farmer/AnalysisPage';

import { OfficerLayout } from './pages/officer/OfficerLayout';
import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { OfficerMap } from './pages/officer/OfficerMap';
import { BlockDetails } from './pages/officer/BlockDetails';
import { OfficerAlerts } from './pages/officer/OfficerAlerts';
import { OfficerAnalytics } from './pages/officer/OfficerAnalytics';

function App() {
  return (
    <LanguageProvider>
      <DemoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LandingPage />} />
              {/* Farmer routes */}
              <Route path="farmer">
                <Route index element={<FarmerDashboard />} />
                <Route path="location" element={<LocationSelection />} />
                <Route path="sowing" element={<SowingDecision />} />
                <Route path="advisory" element={<AdvisoryPage />} />
                <Route path="analysis" element={<AnalysisPage />} />
              </Route>
            </Route>
            
            {/* Officer routes with separate layout */}
            <Route path="/officer" element={<OfficerLayout />}>
              <Route index element={<OfficerDashboard />} />
              <Route path="map" element={<OfficerMap />} />
              <Route path="block/:id" element={<BlockDetails />} />
              <Route path="alerts" element={<OfficerAlerts />} />
              <Route path="analytics" element={<OfficerAnalytics />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DemoProvider>
    </LanguageProvider>
  );
}

export default App;
