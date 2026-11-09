/**
 * Godavari Raksha - Administration, Analytics & Multi-Agency Portal (Modules 12, 23 & Parts 6, 10, 12)
 * Department Coordination, Real-time Analytics, CSV Data Export & 1-Click Synthetic Database Reset
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Network,
  BarChart3,
  Users,
  FileText,
  RotateCcw,
  Download,
  Shield,
  Activity,
  Layers,
  Cpu,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    incidents,
    responseTeams,
    ghats,
    facilities,
    aiAlerts,
    kpis,
    resetAllDemoData,
    currentUser,
    switchUserRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'multiagency' | 'analytics' | 'users' | 'audit' | 'integrations'>('multiagency');
  const [isResetting, setIsResetting] = useState(false);

  // Category breakdown
  const categoryCounts = incidents.reduce((acc: Record<string, number>, inc) => {
    acc[inc.category] = (acc[inc.category] || 0) + 1;
    return acc;
  }, {});

  // CSV Export Generation
  const handleExportCsv = () => {
    const headers = ['IncidentID', 'Category', 'Priority', 'Status', 'Location', 'Title', 'Timestamp', 'AssignedTeam'];
    const rows = incidents.map((inc) => [
      inc.id,
      inc.category,
      inc.priority,
      inc.status,
      `"${inc.locationName.replace(/"/g, '""')}"`,
      `"${inc.title.replace(/"/g, '""')}"`,
      inc.timestamp,
      inc.assignedTeamName ? `"${inc.assignedTeamName.replace(/"/g, '""')}"` : 'Unassigned',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `godavari_raksha_incidents_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetData = async () => {
    if (!window.confirm('Are you sure you want to reset the synthetic demo database to the initial baseline?')) return;
    setIsResetting(true);
    await resetAllDemoData();
    setIsResetting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
            Administration & Operational Governance
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Multi-Agency & Analytics Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Inter-agency operational alignment, performance metrics, CSV exports, and database maintenance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleResetData}
            disabled={isResetting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 rounded-md text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-400" />
            <span>{isResetting ? 'Resetting DB...' : 'Reset Demo Database'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs overflow-x-auto">
        {[
          { id: 'multiagency', label: 'Multi-Agency Coordination (Police/Medical/Rescue)', icon: Network },
          { id: 'analytics', label: 'Analytics & Incident Distribution', icon: BarChart3 },
          { id: 'users', label: 'User Roles & Access Permissions', icon: Users },
          { id: 'integrations', label: 'Integration Adapters Status', icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MULTI-AGENCY COORDINATION */}
      {activeTab === 'multiagency' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Police Department */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400">AP Police Pushkaralu Div</span>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <div>Field Personnel: <b className="text-white font-mono">1,450 Officers</b></div>
                <div>Active Dispatches: <b className="text-teal-400 font-mono">3 Incidents</b></div>
                <div>Help Desks Operating: <b className="text-white font-mono">12 Desks</b></div>
              </div>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                Lead: DSP N. Chandrasekhar (Pushkar Sector)
              </div>
            </div>

            {/* Medical Department */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Medical & Health Services</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <div>Paramedic Fleet: <b className="text-white font-mono">32 Ambulances</b></div>
                <div>Active Triage Camps: <b className="text-white font-mono">8 Tents</b></div>
                <div>Available GGH Beds: <b className="text-emerald-400 font-mono">{kpis.hospitalBedsAvailable} Beds</b></div>
              </div>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                Lead: Dr. M. Swamy (GGH Trauma Head)
              </div>
            </div>

            {/* Fire & SDRF River Rescue */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400">Fire & SDRF River Rescue</span>
                <span className="text-[10px] font-mono bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <div>Jet Rescue Boats: <b className="text-white font-mono">8 Boats on River</b></div>
                <div>Certified Divers: <b className="text-white font-mono">45 Divers</b></div>
                <div>River Rescue Unit: <b className="text-teal-400 font-mono">Unit 01 & 02</b></div>
              </div>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                Lead: Commander B. Naresh (SDRF)
              </div>
            </div>

            {/* Municipal Corporation (RMC) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">Rajamahendravaram Municipal Corp</span>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <div>Sanitation Squads: <b className="text-white font-mono">2,200 Workers</b></div>
                <div>Drinking Water Posts: <b className="text-white font-mono">140 Kiosks</b></div>
                <div>Emergency Barricades: <b className="text-white font-mono">18 Sectors</b></div>
              </div>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                Lead: Executive Engineer V. Ranga Rao
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: ANALYTICS & INCIDENT DISTRIBUTION */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Category Breakdown Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-400" />
                Incident Distribution by Category
              </h3>

              <div className="space-y-2.5 pt-2">
                {Object.entries(categoryCounts).map(([cat, count]) => {
                  const pct = Math.round((count / incidents.length) * 100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-300 capitalize">{cat.replace('_', ' ')}</span>
                        <span className="text-slate-400 font-mono">{count} cases ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance KPI Benchmarks */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-400" />
                Response Performance Benchmarks
              </h3>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400">Avg SOS Acknowledgment</div>
                  <div className="text-xl font-bold text-teal-400 mt-1">48 seconds</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Target: &lt;60s (Met)</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400">Avg Squad Dispatch Time</div>
                  <div className="text-xl font-bold text-white mt-1">3.4 minutes</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Target: &lt;5m (Met)</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400">AI Verification Rate</div>
                  <div className="text-xl font-bold text-teal-400 mt-1">86.4%</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Human Confirmed</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400">Resolution Rate</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">
                    {Math.round((kpis.resolvedCases / kpis.totalIncidents) * 100)}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Successfully Closed</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: USER ROLES */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white">
            Role-Based Access Control (Pushkaralu Security Matrix)
          </h3>
          <p className="text-xs text-slate-400">
            Switch between authorized accounts to test departmental perspective and permission scopes:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { role: 'super_admin', name: 'Srikanth Verma, IAS', title: 'Super Administrator', agency: 'RMC & RTIH' },
              { role: 'control_operator', name: 'Ananya Reddy', title: 'Emergency Control Room Lead', agency: 'Central ECC' },
              { role: 'police_responder', name: 'Inspector K. Prasad', title: 'Police Field Responder', agency: 'Pushkaralu Div' },
              { role: 'medical_responder', name: 'Dr. M. Swamy', title: 'Medical Rapid Squad Lead', agency: 'GGH Hospital' },
              { role: 'fire_responder', name: 'S. Ramana', title: 'River Rescue & Fire Officer', agency: 'SDRF Boat Unit' },
              { role: 'pilgrim', name: 'Venkatesh Naidu', title: 'Pilgrim / Family Group Lead', agency: 'Public User' },
            ].map((usr) => (
              <div
                key={usr.role}
                onClick={() => switchUserRole(usr.role as any)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
                  currentUser.role === usr.role
                    ? 'bg-teal-950/40 border-teal-500 shadow ring-1 ring-teal-500'
                    : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className="text-xs font-bold text-white">{usr.name}</div>
                <div className="text-[11px] text-teal-400 font-medium">{usr.title}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">Agency: {usr.agency}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INTEGRATIONS */}
      {activeTab === 'integrations' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white">
            External Integration Adapters & Sensor Gateways
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-white">Google Gemini 3.8 Flash Multimodal API</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Provides multimodal image frame analysis & multilingual assistance</p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">CONNECTED</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-white">Leaflet & OpenStreetMap GIS Engine</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Renders real-time geo-coordinates along Godavari riverfront</p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">ACTIVE</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-white">Three.js Procedural 3D WebGL Digital Twin</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Simulates water flow waves, terraced steps & crowd density circles</p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">INITIALIZED</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-white">Dowleshwaram Barrage & Polavaram Hydrological Stream</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Water level, flow velocity & 24h rainfall telemetry</p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">TELEMETRY LIVE</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
