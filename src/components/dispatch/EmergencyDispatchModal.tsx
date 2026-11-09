/**
 * Godavari Raksha - Intelligent Emergency Dispatch Modal (Module 05)
 * Calculates distance, capability match, workload, and provides human override
 */

import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Incident, ResponseTeam } from '../../types';
import { apiClient } from '../../services/api';
import { Radio, Check, X, Shield, Navigation, AlertTriangle, Clock } from 'lucide-react';

interface Props {
  incident: Incident;
  onClose: () => void;
}

export const EmergencyDispatchModal: React.FC<Props> = ({ incident, onClose }) => {
  const { responseTeams, assignTeamToIncident } = useApp();
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [operatorNotes, setOperatorNotes] = useState('');

  useEffect(() => {
    let isMounted = true;
    apiClient
      .getDispatchRecommendation(incident.id, incident.category, incident.coordinates)
      .then((data) => {
        if (!isMounted) return;
        setRecommendation(data);
        if (data.recommended?.team?.id) {
          setSelectedTeamId(data.recommended.team.id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Dispatch recommendation error:', err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [incident]);

  const handleDispatch = async () => {
    if (!selectedTeamId) return;
    await assignTeamToIncident(incident.id, selectedTeamId, operatorNotes || 'Dispatched via AI recommendation');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-xl w-full p-5 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono font-bold text-teal-400">
              INTELLIGENT DISPATCH ENGINE · {incident.id}
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              {incident.title}
            </h3>
            <div className="text-xs text-slate-400 mt-1">
              📍 {incident.locationName} · Priority: <span className="text-red-400 font-semibold">{incident.priority}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4">
          
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Evaluating team proximity, workload, and equipment capabilities...
            </div>
          ) : recommendation?.recommended ? (
            <div>
              {/* Primary Recommended Team */}
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-teal-400" />
                Top Recommended Response Squad
              </div>
              
              <div
                onClick={() => setSelectedTeamId(recommendation.recommended.team.id)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  selectedTeamId === recommendation.recommended.team.id
                    ? 'bg-teal-950/40 border-teal-500 shadow-md ring-1 ring-teal-500'
                    : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">
                      {recommendation.recommended.team.name}
                    </span>
                    <div className="text-xs text-teal-300 mt-0.5">
                      {recommendation.recommended.reason}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      ETA ~{recommendation.recommended.estimatedEtaMins} min
                    </span>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {recommendation.recommended.distanceKm} km away
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex flex-wrap gap-1.5 text-[11px] text-slate-300">
                  <span className="text-slate-400">Lead: {recommendation.recommended.team.leadOfficer}</span>
                  <span>·</span>
                  <span className="text-slate-400">Contact: {recommendation.recommended.team.contactNumber}</span>
                  <span>·</span>
                  <span className="text-slate-400">Status: {recommendation.recommended.team.status}</span>
                </div>
              </div>

              {/* Alternative Squads (Human Override) */}
              <div className="mt-3">
                <div className="text-xs font-medium text-slate-400 mb-1.5">
                  Available Alternatives (Human Override):
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {responseTeams
                    .filter((t) => t.id !== recommendation.recommended.team.id && t.status === 'AVAILABLE')
                    .slice(0, 4)
                    .map((team) => (
                      <div
                        key={team.id}
                        onClick={() => setSelectedTeamId(team.id)}
                        className={`p-2.5 rounded-md border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                          selectedTeamId === team.id
                            ? 'bg-teal-950/40 border-teal-500 text-white'
                            : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-white">{team.name}</div>
                          <div className="text-[11px] text-slate-400">{team.agency} · {team.currentLocationName}</div>
                        </div>
                        <div className="text-right font-mono text-[11px] text-slate-300">
                          {team.capabilities[0]}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mt-3">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tactical Dispatch Instructions (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Approach via North Ramp, avoid crowd bottleneck at Gate 2"
                  value={operatorNotes}
                  onChange={(e) => setOperatorNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

            </div>
          ) : (
            <div className="text-xs text-slate-400 text-center py-4">
              No recommended team found.
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDispatch}
            disabled={!selectedTeamId}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-md text-xs font-semibold shadow-md transition-colors"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Confirm & Dispatch Squad</span>
          </button>
        </div>

      </div>
    </div>
  );
};
