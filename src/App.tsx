/**
 * Godavari Raksha - Main Application Root
 * PS-02: Emergency Detection, Public Safety and Response Coordination
 * Godavari Pushkaralu 2027 (RMC & RTIH)
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { SubNavBar } from './components/layout/SubNavBar';
import { ToastContainer } from './components/common/ToastContainer';

// View Components
import { LandingPage } from './components/landing/LandingPage';
import { CommandCentre } from './components/command/CommandCentre';
import { LiveGisMap } from './components/map/LiveGisMap';
import { DigitalTwin3D } from './components/digitaltwin/DigitalTwin3D';
import { AiCctvCentre } from './components/cctv/AiCctvCentre';
import { CrowdRiskDashboard } from './components/crowd/CrowdRiskDashboard';
import { RiverSafetyIntelligence } from './components/river/RiverSafetyIntelligence';
import { HospitalCoordination } from './components/medical/HospitalCoordination';
import { PilgrimApp } from './components/pilgrim/PilgrimApp';
import { FieldResponderApp } from './components/responder/FieldResponderApp';
import { MissingPersonsModule } from './components/missing/MissingPersonsModule';
import { IotNetworkModule } from './components/iot/IotNetworkModule';
import { PublicAnnouncementConsole } from './components/announcements/PublicAnnouncementConsole';
import { EmergencyDrillSimulator } from './components/simulator/EmergencyDrillSimulator';
import { AiDecisionAssistant } from './components/aiassistant/AiDecisionAssistant';
import { AdminPortal } from './components/admin/AdminPortal';

const MainLayout: React.FC = () => {
  const { activeView } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Bar (§2 Contract) */}
      <Header />

      {/* Secondary Workspace Navigation */}
      <SubNavBar />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {activeView === 'landing' && <LandingPage />}
        {activeView === 'command' && <CommandCentre />}
        {activeView === 'gis' && <LiveGisMap />}
        {activeView === 'digital_twin' && <DigitalTwin3D />}
        {activeView === 'cctv' && <AiCctvCentre />}
        {activeView === 'crowd' && <CrowdRiskDashboard />}
        {activeView === 'river' && <RiverSafetyIntelligence />}
        {activeView === 'hospital' && <HospitalCoordination />}
        {activeView === 'pilgrim' && <PilgrimApp />}
        {activeView === 'responder' && <FieldResponderApp />}
        {activeView === 'missing' && <MissingPersonsModule />}
        {activeView === 'iot' && <IotNetworkModule />}
        {activeView === 'announcements' && <PublicAnnouncementConsole />}
        {activeView === 'simulator' && <EmergencyDrillSimulator />}
        {activeView === 'decision_ai' && <AiDecisionAssistant />}
        {activeView === 'admin' && <AdminPortal />}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2027 Rajamahendravaram Municipal Corporation (RMC) & Ratan Tata Innovation Hub (RTIH)
          </span>
          <span className="font-mono text-slate-600">
            Godavari Raksha · Problem Statement PS-02
          </span>
        </div>
      </footer>

      {/* Toast Notification Queue */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
