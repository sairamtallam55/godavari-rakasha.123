/**
 * Godavari Raksha - Smart IoT Emergency Network (Module 21)
 * Ultrasonic water level sensors, LiDAR crowd counters, panic pillars, and device health
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IotDevice } from '../../types';
import {
  Cpu,
  Activity,
  Battery,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Radio,
  RefreshCw,
  Plus,
} from 'lucide-react';

export const IotNetworkModule: React.FC = () => {
  const { iotDevices } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [isSimulatingTelemetry, setIsSimulatingTelemetry] = useState(false);

  const filtered = iotDevices.filter((d) => {
    if (filterType !== 'all' && d.type !== filterType) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
            Module 21 · IoT Sensor Fleet Telemetry
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Smart IoT Emergency Network
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time ultrasonic water depth gauges, overhead LiDAR counters, and waterproof panic pillars.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
            Sensor Fleet Status: <span className="text-emerald-400 font-bold">10/10 Devices Responsive</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs">
        {[
          { id: 'all', label: 'All IoT Devices' },
          { id: 'water_level_sensor', label: 'Ultrasonic Depth' },
          { id: 'crowd_counter', label: 'LiDAR Counters' },
          { id: 'panic_button', label: 'Panic Pillars' },
          { id: 'air_quality', label: 'Heat & Humidity' },
          { id: 'smart_speaker', label: 'IP PA Speakers' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterType === tab.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((device) => {
          let statusBadge = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
          if (device.status === 'WARNING') statusBadge = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
          else if (device.status === 'OFFLINE') statusBadge = 'text-red-400 bg-red-500/10 border-red-500/30';

          return (
            <div
              key={device.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono text-teal-400 font-bold">{device.id}</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">
                    {device.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    📍 {device.locationName}
                  </div>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusBadge}`}>
                  {device.status}
                </span>
              </div>

              {/* Telemetry Box */}
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs">
                <span className="text-[10px] text-slate-400 block mb-0.5">Latest Telemetry Stream:</span>
                <span className="text-white font-bold">{device.telemetryValue}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
                <div className="flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5 text-teal-400" />
                  <span>Battery: {device.batteryPercentage}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ping: {device.lastPing}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
