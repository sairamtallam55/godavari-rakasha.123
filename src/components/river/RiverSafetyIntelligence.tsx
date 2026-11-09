/**
 * Godavari Raksha - River and Flood Safety Intelligence (Module 11)
 * Real-time Godavari River telemetry, flood threshold alarms, barrage discharge & ghat safety
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Waves,
  AlertTriangle,
  TrendingUp,
  Droplets,
  Wind,
  Shield,
  Activity,
  Sliders,
  CheckCircle,
} from 'lucide-react';

export const RiverSafetyIntelligence: React.FC = () => {
  const { riverReadings, simulateRiverSpike } = useApp();
  const [selectedSensorId, setSelectedSensorId] = useState<string>('HYD-PUSHKAR-03');
  const [simLevel, setSimLevel] = useState<number>(14.8);

  const selectedSensor = riverReadings.find((r) => r.sensorId === selectedSensorId) || riverReadings[0];

  const handleSimulate = async () => {
    await simulateRiverSpike(selectedSensorId, simLevel);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
            Module 11 · Hydrological River Safety
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            River & Flood Safety Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Godavari River depth, flow velocity, rainfall telemetry, and automated flash flood warning triggers.
          </p>
        </div>

        {/* River Status Overview */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
            Dowleshwaram Barrage: <span className="text-teal-400 font-bold">13.8m (Normal Discharge)</span>
          </div>
        </div>
      </div>

      {/* Sensor Readings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {riverReadings.map((reading) => {
          const isSelected = reading.sensorId === selectedSensorId;
          let statusBadge = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
          if (reading.status === 'CRITICAL') statusBadge = 'text-red-400 bg-red-500/10 border-red-500/30';
          else if (reading.status === 'WARNING') statusBadge = 'text-amber-400 bg-amber-500/10 border-amber-500/30';

          return (
            <div
              key={reading.id}
              onClick={() => {
                setSelectedSensorId(reading.sensorId);
                setSimLevel(reading.waterLevelMeters);
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-900 border-teal-500 shadow-xl ring-1 ring-teal-500'
                  : 'bg-slate-900/70 border-slate-800 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-mono text-slate-400 truncate max-w-[120px]">
                  {reading.sensorId}
                </span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${statusBadge}`}>
                  {reading.status}
                </span>
              </div>

              <div className="text-xs font-bold text-white mt-1.5 line-clamp-1">
                {reading.locationName}
              </div>

              <div className="mt-2.5 flex items-baseline justify-between font-mono">
                <span className="text-xl font-bold text-white">
                  {reading.waterLevelMeters.toFixed(1)}m
                </span>
                <span className="text-xs text-slate-400">
                  {reading.flowVelocityMps} m/s
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between font-mono">
                <span>Rain: {reading.rainfallMm24h}mm</span>
                <span>Warn: {reading.warningThresholdMeters}m</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Sensor Deep Dive & Simulation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Gauge & Depth Diagnostics (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Waves className="w-4 h-4 text-teal-400" />
                Hydrological Telemetry · {selectedSensor.locationName}
              </h3>
              <div className="text-xs text-slate-400 mt-0.5 font-mono">
                Sensor: {selectedSensor.sensorId} · Updated: {new Date(selectedSensor.recordedAt).toLocaleTimeString()}
              </div>
            </div>

            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                selectedSensor.status === 'CRITICAL'
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : selectedSensor.status === 'WARNING'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              River Status: {selectedSensor.status}
            </span>
          </div>

          {/* Water Level Gauge Representation */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Water Depth Gauge</span>
              <span className="text-teal-400 font-bold">{selectedSensor.waterLevelMeters} / 16.0 meters</span>
            </div>

            <div className="relative w-full h-6 bg-slate-800 rounded-md overflow-hidden flex">
              <div className="w-[85%] bg-emerald-600/30 flex items-center justify-center text-[10px] text-emerald-300 font-mono">
                Safe Bay (&lt;13.8m)
              </div>
              <div className="w-[10%] bg-amber-600/40 flex items-center justify-center text-[10px] text-amber-300 font-mono">
                Warning (14.5m)
              </div>
              <div className="w-[5%] bg-red-600/60 flex items-center justify-center text-[10px] text-red-300 font-mono">
                Danger
              </div>

              {/* Needle Indicator */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all duration-300"
                style={{
                  left: `${Math.min(100, Math.max(0, ((selectedSensor.waterLevelMeters - 12) / 4.5) * 100))}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono pt-2">
              <div className="bg-slate-900 p-2 rounded">
                <div className="text-slate-400 text-[10px]">Current Velocity</div>
                <div className="text-white font-bold mt-0.5">{selectedSensor.flowVelocityMps} m/s</div>
              </div>
              <div className="bg-slate-900 p-2 rounded">
                <div className="text-slate-400 text-[10px]">24h Catchment Rain</div>
                <div className="text-white font-bold mt-0.5">{selectedSensor.rainfallMm24h} mm</div>
              </div>
              <div className="bg-slate-900 p-2 rounded">
                <div className="text-slate-400 text-[10px]">Water Temp</div>
                <div className="text-white font-bold mt-0.5">{selectedSensor.waterTemperatureC}°C</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 space-y-1">
            <div className="font-bold text-white">SDRF River Patrol Directives:</div>
            <div>• Red buoy barrier maintained at 3.0-meter contour along entire ghat frontage.</div>
            <div>• 3 Jet rescue boats stationed at Pushkar Pier, ready for rapid deep-water extraction.</div>
          </div>
        </div>

        {/* Right Column: Live Sensor Simulation Controller (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-400" />
            Sensor Telemetry Simulator
          </h3>
          <p className="text-xs text-slate-400">
            Simulate flash flood conditions or barrage discharge surges to evaluate automated alarm propagation:
          </p>

          <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Simulate Water Level:</span>
                <span className="text-teal-400 font-bold">{simLevel} meters</span>
              </div>
              <input
                type="range"
                min="13.0"
                max="16.5"
                step="0.1"
                value={simLevel}
                onChange={(e) => setSimLevel(parseFloat(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>13.0m (Low)</span>
                <span>14.5m (Warning)</span>
                <span>16.5m (Extreme Flood)</span>
              </div>
            </div>

            <button
              onClick={handleSimulate}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-colors shadow"
            >
              Inject Telemetry Spike
            </button>
          </div>

          <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-lg text-xs text-amber-200 space-y-1">
            <div className="font-bold">Automated Escalation Rule:</div>
            <div>If level crosses 14.5m, sirens activate across IP smart speakers and lower bathing steps are evacuated by police.</div>
          </div>
        </div>

      </div>

    </div>
  );
};
