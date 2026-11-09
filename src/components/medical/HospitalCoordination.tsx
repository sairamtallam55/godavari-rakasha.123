/**
 * Godavari Raksha - Hospital & Emergency Green Corridor Coordination (Modules 19 & 22)
 * Hospital Bed Availability, Triage Camps, Patient Transfer Tracking & Green Corridor Routing
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Navigation,
  Activity,
  Heart,
  Phone,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Radio,
} from 'lucide-react';

export const HospitalCoordination: React.FC = () => {
  const { facilities, responseTeams } = useApp();
  const [activeCorridorAmbulance, setActiveCorridorAmbulance] = useState<string>('team_med_02');
  const [corridorActive, setCorridorActive] = useState(true);

  const hospitals = facilities.filter((f) => f.type === 'hospital' || f.type === 'medical_camp');
  const ambulanceTeams = responseTeams.filter((t) => t.category === 'ambulance');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
            Modules 19 & 22 · Healthcare & Emergency Transit
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Hospital & Green Corridor Coordination
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time GGH hospital bed capacity, triage tent availability, and traffic-cleared emergency green corridors.
          </p>
        </div>

        {/* Total Beds Available Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-200">
            Available Pushkaralu Beds:{' '}
            <span className="text-emerald-400 font-bold">
              {hospitals.reduce((acc, h) => acc + (h.availableBeds || 0), 0)} Beds
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Green Corridor Showcase Card (Flagship Feature) */}
      <div className="bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/40 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Active Emergency Green Corridor
              </div>
              <h3 className="text-base font-bold text-white">
                Pushkar Ghat → GGH Trauma Centre (Danavaipeta Arterial)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              CORRIDOR CLEARED BY TRAFFIC POLICE
            </span>
          </div>
        </div>

        {/* Route Details Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-400">Active Vehicle:</span>
            <div className="text-white font-bold mt-0.5">ALS Unit 02 (AP-05-TX-1082)</div>
          </div>
          <div>
            <span className="text-slate-400">Estimated Transit:</span>
            <div className="text-emerald-400 font-bold mt-0.5">4.2 min (Normally 14 min)</div>
          </div>
          <div>
            <span className="text-slate-400">Signal Priority:</span>
            <div className="text-teal-400 font-bold mt-0.5">All 4 Junctions Green</div>
          </div>
          <div>
            <span className="text-slate-400">Patient Condition:</span>
            <div className="text-amber-400 font-bold mt-0.5">Critical Cardiac · CPR Ongoing</div>
          </div>
        </div>

        {/* Visual Corridor Path Steps */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 pt-1">
          <span className="font-semibold text-white">📍 Pushkar Ghat Bay (Departed)</span>
          <span className="text-teal-400">→</span>
          <span>East River Road (Clear)</span>
          <span className="text-teal-400">→</span>
          <span>Danavaipeta Main Junction (Overridden)</span>
          <span className="text-teal-400">→</span>
          <span className="font-semibold text-emerald-400">🏥 GGH Trauma Emergency Bay (Inbound)</span>
        </div>
      </div>

      {/* Facilities Directory & Bed Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hospitals.map((hospital) => {
          const occupancy = hospital.totalBeds
            ? Math.round((((hospital.totalBeds - (hospital.availableBeds || 0)) / hospital.totalBeds) * 100))
            : 60;

          return (
            <div
              key={hospital.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {hospital.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    📍 {hospital.locationName}
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700">
                  {hospital.type.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Bed Stats */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center font-mono">
                <div>
                  <div className="text-[10px] text-slate-400">Available</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    {hospital.availableBeds || 0}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Total</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {hospital.totalBeds || 20}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">ICU Beds</div>
                  <div className="text-sm font-bold text-amber-400 mt-0.5">
                    {hospital.icuAvailable || 2}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Staff on Duty: <b className="text-white font-mono">{hospital.staffOnDuty}</b></span>
                <a
                  href={`tel:${hospital.contactPhone}`}
                  className="text-teal-400 hover:text-teal-300 font-mono flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>{hospital.contactPhone}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ambulance Fleet Staging */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-400" />
          Active ALS & BLS Medical Fleet Staging
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ambulanceTeams.map((team) => (
            <div
              key={team.id}
              className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5 text-xs"
            >
              <div className="flex justify-between items-center font-semibold">
                <span className="text-white">{team.name}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    team.status === 'AVAILABLE'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {team.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Vehicle: <b className="text-slate-200 font-mono">{team.vehicleNumber}</b> · Lead: {team.leadOfficer}
              </div>
              <div className="text-[11px] text-teal-400">
                Staged at: {team.currentLocationName}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
