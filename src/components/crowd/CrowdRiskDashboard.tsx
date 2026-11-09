/**
 * Godavari Raksha - AI Crowd Risk Monitoring & Flow Prediction (Modules 08 & 09)
 * Ghat-Wise Crowd Density, Directional Flow Vectors, Bottleneck Warning & Automated Mitigation
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  Shield,
  Layers,
  CheckCircle,
  Volume2,
  Navigation,
} from 'lucide-react';

export const CrowdRiskDashboard: React.FC = () => {
  const { ghats, postAnnouncement } = useApp();
  const [selectedGhatId, setSelectedGhatId] = useState<string>('ghat_pushkar');

  const selectedGhat = ghats.find((g) => g.id === selectedGhatId) || ghats[0];

  // Flow simulation telemetry for each ghat
  const flowVectors = [
    { from: 'Railway Station Road', to: 'Pushkar Gate 1', rate: '240/min', trend: 'INCREASING', risk: 'HIGH' },
    { from: 'Pushkar Gate 2 Ramp', to: 'Bathing Terrace', rate: '185/min', trend: 'CONGESTED', risk: 'CRITICAL' },
    { from: 'Bathing Terrace', to: 'Clock Tower Exit', rate: '90/min', trend: 'BOTTLENECK', risk: 'CRITICAL' },
    { from: 'Temple Corridor', to: 'Kotilingala Gate 2', rate: '210/min', trend: 'HIGH', risk: 'HIGH' },
    { from: 'Kotilingala Steps', to: 'North Walkway Exit', rate: '160/min', trend: 'STEADY', risk: 'MODERATE' },
    { from: 'Saraswathi Bay', to: 'Park Exit Way', rate: '110/min', trend: 'NOMINAL', risk: 'LOW' },
  ];

  const handleBroadcastDiversion = (ghatName: string) => {
    postAnnouncement({
      title: `${ghatName} Crowd Diversion Notice`,
      messageText: `గౌరవనీయ భక్తులకు విజ్ఞప్తి: ${ghatName} వద్ద రద్దీ ఎక్కువగా ఉన్నందున, ప్రత్యామ్నాయ సరస్వతీ ఘాట్ వైపు మళ్లవలసిందిగా కోరుతున్నాము. Attention Pilgrims: High crowd density detected at ${ghatName}. Please follow volunteers towards Saraswathi Ghat.`,
      language: 'all',
      targetZones: [ghatName, 'Main Approaches'],
      priority: 'EMERGENCY',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
            Modules 08 & 09 · Predictive Crowd Dynamics
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Crowd Risk & Flow Prediction
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            LiDAR and CCTV telemetry estimating incoming vs. outbound pilgrims, bottlenecks, and automated diversion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleBroadcastDiversion(selectedGhat.name)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-md text-xs font-semibold shadow transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Broadcast Diversion PA</span>
          </button>
        </div>
      </div>

      {/* Ghat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ghats.map((ghat) => {
          const occupancyPct = Math.round((ghat.currentCrowdCount / ghat.capacityPilgrims) * 100);
          let riskBadge = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
          if (ghat.crowdRiskLevel === 'CRITICAL') {
            riskBadge = 'text-red-400 bg-red-500/10 border-red-500/30';
          } else if (ghat.crowdRiskLevel === 'HIGH') {
            riskBadge = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
          }

          const isSelected = ghat.id === selectedGhatId;

          return (
            <div
              key={ghat.id}
              onClick={() => setSelectedGhatId(ghat.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-900 border-teal-500 shadow-xl ring-1 ring-teal-500'
                  : 'bg-slate-900/70 border-slate-800 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {ghat.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {ghat.teluguName}
                  </div>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${riskBadge}`}>
                  {ghat.crowdRiskLevel}
                </span>
              </div>

              {/* Occupancy Bar */}
              <div className="mt-3.5">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Occupancy</span>
                  <span className="text-white font-bold">{occupancyPct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      occupancyPct > 85 ? 'bg-red-500' : occupancyPct > 65 ? 'bg-amber-500' : 'bg-teal-500'
                    }`}
                    style={{ width: `${Math.min(occupancyPct, 100)}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{ghat.currentCrowdCount.toLocaleString()} Pilgrims</span>
                <span>Cap: {ghat.capacityPilgrims.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Ghat Flow & Bottleneck Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Directional Flow Vectors (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-teal-400" />
                Crowd Movement Directional Vectors · {selectedGhat.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculates transit differential between feeder lanes and discharge stairs
              </p>
            </div>
            <span className="text-xs font-mono text-teal-400">
              LiDAR Feed Live
            </span>
          </div>

          {/* Vectors List */}
          <div className="space-y-2.5">
            {flowVectors.map((vec, i) => (
              <div
                key={i}
                className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-medium">{vec.from}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="text-white font-semibold">{vec.to}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-mono text-[11px]">
                    {vec.rate}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      vec.risk === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-400'
                        : vec.risk === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {vec.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg text-xs text-red-200">
            <span className="font-bold">Bottleneck Detected at Staircase Exit #2:</span> Outbound flow is 52% slower than arrival rate. Holding area pen diversion recommended before step density exceeds 5.0 persons/m².
          </div>
        </div>

        {/* Right Column: Automated Tactical Mitigation Recommendations (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-400" />
            Prescriptive Crowd Mitigation Plan
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="font-semibold text-teal-400">1. Gate Throttle Protocol</div>
              <p className="text-slate-300 mt-1">
                Restrict Gate 1 inflow to batches of 500 pilgrims every 4 minutes to match current stair discharge rate.
              </p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="font-semibold text-amber-400">2. Deploy Barricade Diverters</div>
              <p className="text-slate-300 mt-1">
                Dispatch Pushkar Crowd Control Batt 1 to open Peripheral Ramp #3 as exclusive outbound channel.
              </p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="font-semibold text-blue-400">3. Transit Holding Pen Activation</div>
              <p className="text-slate-300 mt-1">
                Direct incoming tourist buses to Subrahmanya Maidanam holding grounds for 20-minute flow dampening.
              </p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => handleBroadcastDiversion(selectedGhat.name)}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold text-xs shadow transition-colors"
            >
              Execute Integrated Mitigation Protocol
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
