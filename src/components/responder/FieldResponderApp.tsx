/**
 * Godavari Raksha - Field Responder Mobile Application (Module 06)
 * Dedicated Tactical Mobile Interface for Police, Paramedics, and River Rescue squads
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IncidentStatus } from '../../types';
import {
  Radio,
  MapPin,
  Check,
  X,
  Navigation,
  Clock,
  Shield,
  Activity,
  Phone,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { ResponderMiniMap } from './ResponderMiniMap';

export const FieldResponderApp: React.FC = () => {
  const {
    currentUser,
    incidents,
    responseTeams,
    updateResponderStatus,
    resolveIncident,
  } = useApp();

  const [isAvailable, setIsAvailable] = useState(true);
  const [activeIncidentNotes, setActiveIncidentNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  // Find teams or assigned incidents
  const myAssignedIncidents = incidents.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED' && i.status !== 'REJECTED_AS_FALSE_ALARM'
  );

  const primaryIncident = myAssignedIncidents[0];

  // Tactical GPS coordinates for the current responder
  const assignedTeam = responseTeams.find(
    (t) => t.leadOfficer === currentUser.name || t.agency === currentUser.agency || t.status === 'DISPATCHED'
  ) || responseTeams[0];

  const responderCoords: [number, number] = assignedTeam?.coordinates
    ? [assignedTeam.coordinates.lat, assignedTeam.coordinates.lng]
    : [16.9950, 81.7735]; // Default: Pushkaralu Central Patrol Post

  const handleUpdateStatus = async (status: IncidentStatus) => {
    if (!primaryIncident) return;
    await updateResponderStatus(
      primaryIncident.id,
      status,
      activeIncidentNotes || `Status updated to ${status} by ${currentUser.name}`
    );
    setActiveIncidentNotes('');
  };

  const handleResolve = async () => {
    if (!primaryIncident) return;
    await resolveIncident(
      primaryIncident.id,
      activeIncidentNotes || `Successfully resolved by ${currentUser.name}`
    );
    setActiveIncidentNotes('');
  };

  return (
    <div className="max-w-md mx-auto min-h-[calc(100vh-7.5rem)] bg-slate-900 border-x border-slate-800 flex flex-col shadow-2xl text-slate-100">
      
      {/* Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              {currentUser.name}
              <span className="text-[10px] font-mono text-teal-400 font-normal">
                {currentUser.badgeNumber || 'RESP-01'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              {currentUser.agency || 'Emergency Response Fleet'}
            </div>
          </div>
        </div>

        {/* Availability Toggle */}
        <button
          onClick={() => setIsAvailable(!isAvailable)}
          className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${
            isAvailable
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {isAvailable ? 'ON DUTY' : 'STANDBY'}
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Active Incident Dispatch Alert */}
        {primaryIncident ? (
          <div className="bg-slate-950 border-2 border-amber-500/50 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">
                ACTIVE DISPATCH · {primaryIncident.id}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-red-600 text-white rounded">
                {primaryIncident.priority}
              </span>
            </div>

            {/* Tactical Mini Map: Responder relative to Dispatch location */}
            <ResponderMiniMap
              responderCoords={responderCoords}
              dispatchCoords={[primaryIncident.coordinates.lat, primaryIncident.coordinates.lng]}
              responderName={currentUser.name}
              dispatchLocationName={primaryIncident.locationName}
              incidentTitle={primaryIncident.title}
            />

            <div>
              <h3 className="text-base font-bold text-white leading-snug">
                {primaryIncident.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {primaryIncident.description}
              </p>
            </div>

            {/* Location & Navigation */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-2 text-xs">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold">{primaryIncident.locationName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Coords: {primaryIncident.coordinates.lat.toFixed(4)}, {primaryIncident.coordinates.lng.toFixed(4)}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Current Status:</span>
                <span className="text-amber-400 font-bold">{primaryIncident.status}</span>
              </div>
            </div>

            {/* Reporter Contact */}
            <div className="flex items-center justify-between text-xs text-slate-300 px-1">
              <span>Reporter: {primaryIncident.reporter.name}</span>
              <a
                href={`tel:${primaryIncident.reporter.phone}`}
                className="flex items-center gap-1 text-teal-400 hover:text-teal-300 font-mono"
              >
                <Phone className="w-3 h-3" />
                <span>{primaryIncident.reporter.phone}</span>
              </a>
            </div>

            {/* Response Notes Input */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Responder Tactical Update:
              </label>
              <input
                type="text"
                placeholder="e.g. Arrived on scene, patient conscious, AED applied"
                value={activeIncidentNotes}
                onChange={(e) => setActiveIncidentNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-md p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Progressive Workflow Buttons */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              {primaryIncident.status === 'ASSIGNED' && (
                <button
                  onClick={() => handleUpdateStatus('ACCEPTED')}
                  className="py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-colors shadow"
                >
                  Accept Assignment
                </button>
              )}

              {primaryIncident.status === 'ACCEPTED' && (
                <button
                  onClick={() => handleUpdateStatus('RESPONDING')}
                  className="py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-colors shadow flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Mark En Route</span>
                </button>
              )}

              {(primaryIncident.status === 'RESPONDING' || primaryIncident.status === 'ASSIGNED') && (
                <button
                  onClick={() => handleUpdateStatus('ARRIVED')}
                  className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow"
                >
                  Mark Arrived on Scene
                </button>
              )}

              {primaryIncident.status === 'ARRIVED' && (
                <button
                  onClick={handleResolve}
                  className="col-span-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold transition-colors shadow flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Mitigate & Resolve Incident</span>
                </button>
              )}

              <button
                onClick={() => setShowRejectModal(primaryIncident.id)}
                className="py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs transition-colors"
              >
                Decline / Reassign
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 text-center">
            <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">All Assigned Incidents Cleared</h4>
            <p className="text-xs text-slate-400 mt-1">
              Your squad is on active standby in Kotilingala Sector. Stand by for automated dispatch.
            </p>
          </div>
        )}

        {/* Squad Performance & Today's Summary */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Today's Field Activity Summary
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <div className="text-lg font-mono font-bold text-white">6</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Dispatches</div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <div className="text-lg font-mono font-bold text-emerald-400">5</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Resolved</div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <div className="text-lg font-mono font-bold text-teal-400">2.8m</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Avg Response</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
