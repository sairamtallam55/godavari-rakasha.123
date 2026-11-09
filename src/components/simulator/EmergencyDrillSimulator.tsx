/**
 * Godavari Raksha - Emergency Drill & Disaster Simulator (Module 24)
 * Scenario Planning, Multi-Ghat Surge Testing & Tabletop Preparedness Simulations
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SimulationScenario } from '../../types';
import {
  Flame,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Users,
  Radio,
  FileText,
  Shield,
  Activity,
  Download,
} from 'lucide-react';

export const EmergencyDrillSimulator: React.FC = () => {
  const { simulationScenarios } = useApp();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('SIM-001');
  const [isRunning, setIsRunning] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [drillLog, setDrillLog] = useState<string[]>([]);

  const selected = simulationScenarios.find((s) => s.id === selectedScenarioId) || simulationScenarios[0];

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setSimProgress((prev) => {
          if (prev >= 100) {
            setIsRunning(false);
            setDrillLog((logs) => [
              ...logs,
              `[T+15:00] Scenario Completed. All diversion protocols verified. Casualties prevented: 100%.`,
            ]);
            return 100;
          }

          const next = prev + 5;
          if (next === 20) {
            setDrillLog((logs) => [...logs, `[T+02:00] Influx alert detected. Density reached 5.1 persons/m².`]);
          } else if (next === 50) {
            setDrillLog((logs) => [...logs, `[T+06:30] Holding pens activated. Gate 1 restricted to batch release.`]);
          } else if (next === 80) {
            setDrillLog((logs) => [...logs, `[T+11:00] Alternative route clear. Flow rate stabilized to 120/min.`]);
          }

          return next;
        });
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    if (simProgress >= 100) {
      setSimProgress(0);
      setDrillLog([`[T+00:00] Simulation initialized: ${selected.title}`]);
    } else if (drillLog.length === 0) {
      setDrillLog([`[T+00:00] Simulation initialized: ${selected.title}`]);
    }
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSimProgress(0);
    setDrillLog([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
            Module 24 · Emergency Preparedness & Tabletop Simulator
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Emergency Drill & Disaster Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Test multi-ghat stampede scenarios, river flood surges, and ambulance corridor blockages prior to Pushkaralu 2027.
          </p>
        </div>

        {/* Clear Synthetic Warning Label */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-mono text-amber-300">
            SIMULATION ENVIRONMENT · Synthetic Operational Data
          </div>
        </div>
      </div>

      {/* Scenario Selector Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {simulationScenarios.map((sc) => {
          const isSelected = sc.id === selectedScenarioId;
          return (
            <div
              key={sc.id}
              onClick={() => {
                setSelectedScenarioId(sc.id);
                handleReset();
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-900 border-teal-500 shadow-xl ring-1 ring-teal-500'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{sc.id}</span>
                <span className={sc.severity === 'CRITICAL' ? 'text-red-400 font-bold' : 'text-amber-400 font-bold'}>
                  {sc.severity}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mt-1 line-clamp-2">
                {sc.title}
              </h4>
            </div>
          );
        })}
      </div>

      {/* Active Drill Control Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Scenario Details & Execution Engine (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-teal-400">{selected.id}</span>
              <h3 className="text-base font-bold text-white mt-0.5">{selected.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {selected.description}
              </p>
            </div>
          </div>

          {/* Drill Progress Bar */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Drill Execution Timeline:</span>
              <span className="text-teal-400 font-bold">{simProgress}% (T+{Math.round((simProgress * 15) / 100)}m)</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-300"
                style={{ width: `${simProgress}%` }}
              />
            </div>

            {/* Drill Control Buttons */}
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={isRunning ? () => setIsRunning(false) : handleStart}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow ${
                    isRunning
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-teal-600 hover:bg-teal-500 text-white'
                  }`}
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isRunning ? 'Pause Scenario' : simProgress >= 100 ? 'Re-run Drill' : 'Run Drill'}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              <span className="text-xs font-mono text-slate-400">
                Speed: 1.0x Realtime Simulation
              </span>
            </div>
          </div>

          {/* Tactical Recommendations */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider block">
              SOP Action Checklist for this Scenario:
            </span>
            <div className="space-y-1.5">
              {selected.recommendedActions.map((act, i) => (
                <div key={i} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded border border-slate-800">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-slate-200">{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Simulation Operational Log & Impact Report (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            Live Scenario Event Stream
          </h3>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Simulated Crowd:</span>
              <span className="text-white font-bold">{selected.simulatedPilgrimCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Affected Zones:</span>
              <span className="text-amber-400 font-bold">{selected.affectedZones.join(', ')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Risk Severity:</span>
              <span className="text-red-400 font-bold">{selected.expectedCasualtyRisk}</span>
            </div>
          </div>

          {/* Real-time Step Logs */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 h-60 overflow-y-auto space-y-2 text-[11px] font-mono">
            {drillLog.length === 0 ? (
              <div className="text-slate-500 text-center py-12">
                Click "Run Drill" to start event stream
              </div>
            ) : (
              drillLog.map((log, i) => (
                <div key={i} className="text-teal-300 leading-relaxed border-b border-slate-900 pb-1">
                  {log}
                </div>
              ))
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => alert(`Drill Report for ${selected.title} generated successfully.`)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Export After-Action Review (PDF/JSON)</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
