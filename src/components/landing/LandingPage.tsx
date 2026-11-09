/**
 * Godavari Raksha - Official Landing Page & Smart City Portal (Part 1 & 11)
 * PS-02: Emergency Detection, Public Safety and Response Coordination
 * Rajamahendravaram Municipal Corporation (RMC) & Ratan Tata Innovation Hub (RTIH)
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Radio,
  Box,
  MapPin,
  Camera,
  Users,
  Waves,
  Heart,
  Search,
  Sparkles,
  ArrowRight,
  Activity,
  CheckCircle,
  FileText,
  Flame,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView, switchUserRole, kpis } = useApp();

  const launchpads = [
    {
      id: 'command' as const,
      title: 'Emergency Command Centre',
      role: 'control_operator' as const,
      desc: 'Centralized 24-metric operational dashboard, critical SOS verification, and intelligent squad dispatch.',
      icon: Activity,
      badge: 'Command Web App',
      color: 'border-teal-500/40 text-teal-400 bg-teal-500/10',
    },
    {
      id: 'gis' as const,
      title: 'Live GIS Emergency Map',
      role: 'control_operator' as const,
      desc: 'Interactive Leaflet GIS map with 8 Pushkaralu ghats, real-time squad GPS, hospitals, and heat zones.',
      icon: MapPin,
      badge: 'GIS Intelligence',
      color: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    },
    {
      id: 'digital_twin' as const,
      title: 'Godavari Digital Twin 3D',
      role: 'super_admin' as const,
      desc: 'Three.js procedural 3D model of Godavari riverfront, terraced steps, Havelock rail bridge, and flood simulations.',
      icon: Box,
      badge: 'Spatial Digital Twin',
      color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
    },
    {
      id: 'pilgrim' as const,
      title: 'Pilgrim Mobile Application',
      role: 'pilgrim' as const,
      desc: 'One-tap emergency SOS with GPS, family safety group connect, QR pass, and Telugu/Hindi AI assistant.',
      icon: Users,
      badge: 'Pilgrim PWA',
      color: 'border-red-500/40 text-red-400 bg-red-500/10',
    },
    {
      id: 'responder' as const,
      title: 'Field Responder Mobile App',
      role: 'police_responder' as const,
      desc: 'Frontline mobile app for paramedics, police, and river rescue with turn-by-turn routing and status reporting.',
      icon: Radio,
      badge: 'Field Squad PWA',
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    },
    {
      id: 'cctv' as const,
      title: 'AI CCTV Detection Centre',
      role: 'control_operator' as const,
      desc: 'Multimodal computer vision pipeline with Gemini 3.8 Flash for crowd surge, motionless persons, and river breaches.',
      icon: Camera,
      badge: 'Computer Vision',
      color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    },
  ];

  const demoScenarios = [
    {
      id: 'sc1',
      title: 'Scenario 1: Medical Emergency & Rapid Dispatch',
      desc: 'Pilgrim triggers SOS at Pushkar Ghat → GPS logged → AI Recommender assigns Rapid Squad 04 → Arrival tracked.',
      targetView: 'command' as const,
    },
    {
      id: 'sc2',
      title: 'Scenario 2: Multimodal AI CCTV Crowd Surge',
      desc: 'AI inspects frame → Identifies 5.4 persons/m² congestion → Operator reviews & escalates → Barricade squad dispatched.',
      targetView: 'cctv' as const,
    },
    {
      id: 'sc3',
      title: 'Scenario 3: River Water Level Warning & Sensor Spike',
      desc: 'Dowleshwaram sensor triggers warning threshold → River safety alert broadcast → Siren advisories initiated.',
      targetView: 'river' as const,
    },
    {
      id: 'sc4',
      title: 'Scenario 4: 3D Digital Twin Crowd Congestion Drill',
      desc: '3D virtual model runs evening Mahaharathi drill → Highlights bottleneck on stone stairs → Alternative route verified.',
      targetView: 'digital_twin' as const,
    },
    {
      id: 'sc5',
      title: 'Scenario 5: Missing Child & Family Reunification',
      desc: 'Child reported lost → 12 help desks alerted with description → QR Safety wristband scan confirms reunification.',
      targetView: 'missing' as const,
    },
    {
      id: 'sc6',
      title: 'Scenario 6: Emergency Ambulance Green Corridor',
      desc: 'Critical trauma case → Traffic police green corridor clears Danavaipeta junction → Transit time slashed to 4 min.',
      targetView: 'hospital' as const,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl overflow-hidden">
        
        {/* Subtle Background Mesh */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/30 rounded-full text-xs font-mono text-teal-400">
            <span>RMC & RTIH Challenge: Godavari Pushkaralu 2027</span>
            <span>·</span>
            <span className="font-bold">PS-02 Selected</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            GODAVARI RAKSHA
          </h1>
          
          <p className="text-lg text-teal-300 font-medium leading-snug">
            Protecting Every Pilgrim. Predicting Every Risk. Responding to Every Emergency.
          </p>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl pt-1">
            An interconnected, intelligent public-safety ecosystem integrating multimodal Gemini AI, Three.js 3D Digital Twin, live GIS emergency maps, IoT telemetry, and multi-agency response to safeguard millions of devotees along the holy Godavari riverfront.
          </p>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
            <div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {kpis.totalIncidents}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Tracked Incidents</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-teal-400 tabular-nums">
                8 Holy Ghats
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Real-Time Telemetry</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                12 Squads
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Police & Rescue Units</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                3.4 min
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Avg Response Time</div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveView('command')}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow-lg transition-colors"
            >
              <span>Launch Command Centre</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveView('digital_twin')}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <Box className="w-4 h-4 text-teal-400" />
              <span>Explore Digital Twin 3D</span>
            </button>
            <button
              onClick={() => setActiveView('pilgrim')}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <Users className="w-4 h-4 text-teal-400" />
              <span>Pilgrim Mobile SOS</span>
            </button>
          </div>
        </div>

      </div>

      {/* 5 Interconnected Application Launchpads */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Five Interconnected Application Experiences
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              All interfaces communicate with the same real-time database and shared business logic.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {launchpads.map((lp) => {
            const Icon = lp.icon;
            return (
              <div
                key={lp.id}
                onClick={() => {
                  switchUserRole(lp.role);
                  setActiveView(lp.id);
                }}
                className="p-5 bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl cursor-pointer transition-all shadow-lg hover:shadow-2xl group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${lp.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                      {lp.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                    {lp.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {lp.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-teal-400 font-semibold">
                  <span>Open Application View</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Pushkaralu 2027 Demonstration Scenarios (Part 11) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <div className="text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
            Part 11 · Interactive Live Demonstrations
          </div>
          <h2 className="text-lg font-bold text-white mt-0.5">
            End-to-End Pushkaralu Emergency Workflows
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Test any of the 6 end-to-end incident lifecycles operating on the live synchronized database:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {demoScenarios.map((sc) => (
            <div
              key={sc.id}
              onClick={() => setActiveView(sc.targetView)}
              className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition-colors space-y-2 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xs font-bold text-white leading-snug">
                  {sc.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {sc.desc}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-teal-400 font-medium">
                <span>Run Demonstration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
