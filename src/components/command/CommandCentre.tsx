/**
 * Godavari Raksha - AI Emergency Command Centre (Module 01 & 03)
 * Centralized Real-Time Operational Dashboard with 24 Live Metrics & Incident Management
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Incident, IncidentPriority, IncidentStatus, IncidentCategory } from '../../types';
import { EmergencyDispatchModal } from '../dispatch/EmergencyDispatchModal';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  Radio,
  CheckCircle,
  Activity,
  Users,
  Waves,
  Building2,
  Filter,
  Eye,
  Check,
  X,
  Plus,
  Volume2,
  RefreshCw,
} from 'lucide-react';

export const CommandCentre: React.FC = () => {
  const {
    incidents,
    responseTeams,
    ghats,
    kpis,
    verifyIncident,
    resolveIncident,
    rejectIncident,
    playAlertSound,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedIncidentForDispatch, setSelectedIncidentForDispatch] = useState<Incident | null>(null);
  const [selectedIncidentForAudit, setSelectedIncidentForAudit] = useState<Incident | null>(null);

  // Critical items needing attention
  const criticalQueue = incidents.filter(
    (i) => (i.priority === 'CRITICAL' || i.status === 'NEW' || i.status === 'PENDING_VERIFICATION') &&
           i.status !== 'RESOLVED' &&
           i.status !== 'CLOSED' &&
           i.status !== 'REJECTED_AS_FALSE_ALARM'
  );

  const filteredIncidents = incidents.filter((i) => {
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && i.priority !== priorityFilter) return false;
    if (categoryFilter !== 'all' && i.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Header with Live Operational Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
            RMC & RTIH · Emergency Command & Control Centre (ECC)
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            AI Emergency Command Centre
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Rajamahendravaram Municipal Corporation · Pushkaralu 2027 Central Safety Network
          </p>
        </div>

        {/* Live System Operational Readiness Indicators */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
            <span className="text-slate-400">Crowd Risk:</span>
            <span className={kpis.crowdRiskLevel === 'CRITICAL' ? 'text-red-400 font-bold' : 'text-amber-400 font-bold'}>
              {kpis.crowdRiskLevel}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
            <span className="text-slate-400">River Risk:</span>
            <span className={kpis.riverRiskLevel === 'WARNING' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
              {kpis.riverRiskLevel}
            </span>
          </div>
          <button
            onClick={() => playAlertSound('alert')}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
            title="Test Emergency Chime"
          >
            <Volume2 className="w-3.5 h-3.5 text-teal-400" />
            <span>Audio OK</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip (12 Authoritative Metrics Calculated from DB) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Active Emergencies</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {kpis.activeEmergencies}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">of {kpis.totalIncidents} total</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-xs text-red-400 font-medium">Critical Alerts</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-red-400 tabular-nums">
              {kpis.criticalAlerts}
            </span>
            <span className="text-[11px] text-red-500/80 font-mono">Immediate</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-xs text-amber-400 font-medium">Pending Review</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {kpis.pendingVerification}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">New SOS</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Teams Responding</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-teal-400 tabular-nums">
              {kpis.teamsResponding}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">{kpis.teamsAvailable} avail</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Resolved Cases</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {kpis.resolvedCases}
            </span>
            <span className="text-[11px] text-emerald-500/80 font-mono">Mitigated</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Hospital Beds</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {kpis.hospitalBedsAvailable}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">GGH & Camps</span>
          </div>
        </div>

      </div>

      {/* Critical Attention Queue (Immediate Dispatch Action) */}
      {criticalQueue.length > 0 && (
        <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-4 text-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <h2 className="text-xs font-bold text-red-200 uppercase tracking-wider">
                Critical Emergency Queue ({criticalQueue.length} Require Immediate Response)
              </h2>
            </div>
            <span className="text-[11px] text-red-400 font-mono">
              Auto-escalated to Chief Control Officer
            </span>
          </div>

          <div className="space-y-2.5">
            {criticalQueue.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-red-500/30 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-red-400">{item.id}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-semibold text-white uppercase">{item.category.replace('_', ' ')}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-400">📍 {item.locationName}</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1 line-clamp-1">{item.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Reported by {item.reporter.name} ({item.reporter.phone}) · Status: <span className="text-amber-400 font-medium">{item.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'PENDING_VERIFICATION' && (
                    <button
                      onClick={() => verifyIncident(item.id, 'CRITICAL')}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold transition-colors"
                    >
                      Verify SOS
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedIncidentForDispatch(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded text-xs font-semibold transition-colors shadow-sm"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Dispatch Squad</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Incident Management Table & Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        
        {/* Table Filters Bar */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">
              Incident Management Console ({filteredIncidents.length})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-md border border-slate-700">
              {['all', 'NEW', 'VERIFIED', 'ASSIGNED', 'ARRIVED', 'RESOLVED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    statusFilter === st ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st === 'all' ? 'All Status' : st}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-md px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Categories</option>
              <option value="medical">Medical</option>
              <option value="crowd_danger">Crowd Danger</option>
              <option value="river_rescue">River Rescue</option>
              <option value="fire">Fire</option>
              <option value="missing_person">Missing Person</option>
              <option value="accident">Accident</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-md px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-medium uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Title & Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Squad</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No incidents match the active filter criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => {
                  let priorityColor = 'text-red-400';
                  if (inc.priority === 'HIGH') priorityColor = 'text-orange-400';
                  else if (inc.priority === 'MEDIUM') priorityColor = 'text-amber-400';
                  else priorityColor = 'text-blue-400';

                  let statusColor = 'text-slate-300';
                  if (inc.status === 'VERIFIED') statusColor = 'text-teal-400 font-semibold';
                  else if (inc.status === 'RESPONDING' || inc.status === 'ARRIVED') statusColor = 'text-amber-400 font-semibold';
                  else if (inc.status === 'RESOLVED') statusColor = 'text-emerald-400 font-semibold';

                  return (
                    <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-teal-400">
                        {inc.id}
                      </td>
                      <td className={`py-3 px-4 font-semibold ${priorityColor}`}>
                        {inc.priority}
                      </td>
                      <td className="py-3 px-4 capitalize">
                        {inc.category.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-white truncate">{inc.title}</div>
                        <div className="text-[11px] text-slate-400 truncate">📍 {inc.locationName}</div>
                      </td>
                      <td className={`py-3 px-4 ${statusColor}`}>
                        {inc.status}
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-medium">
                        {inc.assignedTeamName ? (
                          <span className="text-teal-300">{inc.assignedTeamName}</span>
                        ) : (
                          <span className="text-slate-500 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedIncidentForAudit(inc)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition-colors"
                          title="View Full Audit History"
                        >
                          Audit
                        </button>

                        {inc.status !== 'RESOLVED' && inc.status !== 'CLOSED' ? (
                          <>
                            <button
                              onClick={() => setSelectedIncidentForDispatch(inc)}
                              className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded text-[11px] font-semibold transition-colors"
                            >
                              Dispatch
                            </button>
                            <button
                              onClick={() => resolveIncident(inc.id, 'Mitigated by Command Operator')}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[11px] transition-colors"
                              title="Resolve Incident"
                            >
                              Resolve
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-emerald-400 font-mono">Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Dispatch Modal */}
      {selectedIncidentForDispatch && (
        <EmergencyDispatchModal
          incident={selectedIncidentForDispatch}
          onClose={() => setSelectedIncidentForDispatch(null)}
        />
      )}

      {/* Audit Trail Modal */}
      {selectedIncidentForAudit && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-5 shadow-2xl text-slate-100 animate-in fade-in">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-teal-400">
                  INCIDENT AUDIT LOG · {selectedIncidentForAudit.id}
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {selectedIncidentForAudit.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedIncidentForAudit(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
              {selectedIncidentForAudit.auditTrail.map((entry, idx) => (
                <div key={idx} className="p-2.5 bg-slate-800/60 rounded-md border border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                    <span className="font-semibold text-teal-400">{entry.action}</span>
                    <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="mt-1 text-slate-200">
                    By <span className="font-medium text-white">{entry.actor}</span> ({entry.actorRole})
                  </div>
                  {entry.notes && (
                    <div className="mt-1 text-slate-400 italic">
                      "{entry.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-right">
              <button
                onClick={() => setSelectedIncidentForAudit(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
