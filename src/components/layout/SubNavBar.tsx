/**
 * Godavari Raksha - Secondary Workspace Module Navigation
 * Provides single-line, clean segmented access to all 24 modules
 */

import React from 'react';
import { useApp, AppViewMode } from '../../context/AppContext';
import {
  LayoutDashboard,
  MapPin,
  Box,
  Smartphone,
  Radio,
  Camera,
  Users,
  Waves,
  Building2,
  Search,
  Volume2,
  Cpu,
  Flame,
  Brain,
  Network,
  BarChart3,
  Settings,
} from 'lucide-react';

export const SubNavBar: React.FC = () => {
  const { activeView, setActiveView } = useApp();

  const navItems: { id: AppViewMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'landing', label: 'Overview', icon: LayoutDashboard },
    { id: 'command', label: 'Command Centre', icon: LayoutDashboard },
    { id: 'gis', label: 'Live GIS Map', icon: MapPin },
    { id: 'digital_twin', label: 'Digital Twin 3D', icon: Box },
    { id: 'cctv', label: 'AI CCTV Detection', icon: Camera },
    { id: 'crowd', label: 'Crowd Flow & Risk', icon: Users },
    { id: 'river', label: 'River & Flood Safety', icon: Waves },
    { id: 'hospital', label: 'Hospital & Green Corridor', icon: Building2 },
    { id: 'pilgrim', label: 'Pilgrim SOS & App', icon: Smartphone },
    { id: 'responder', label: 'Field Responder App', icon: Radio },
    { id: 'missing', label: 'Missing Persons', icon: Search },
    { id: 'iot', label: 'IoT Sensor Network', icon: Cpu },
    { id: 'announcements', label: 'PA Broadcast Studio', icon: Volume2 },
    { id: 'simulator', label: 'Emergency Drill Simulator', icon: Flame },
    { id: 'decision_ai', label: 'AI Copilot Assistant', icon: Brain },
    { id: 'admin', label: 'Multi-Agency & Analytics', icon: Network },
  ];

  return (
    <div className="bg-slate-950 border-b border-slate-800/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
