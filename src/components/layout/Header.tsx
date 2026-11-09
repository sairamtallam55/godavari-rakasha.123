/**
 * Godavari Raksha - Header Component
 * Strictly complies with the Top Bar Contract (§2):
 * [Brand title, one line] — [4–5 nav links, 1–2 word labels, single-line] — [1 primary action]
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { ShieldAlert, Globe, ChevronDown, Check } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeView, setActiveView, currentUser, switchUserRole, language, setLanguage, kpis } = useApp();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const roles: { role: UserRole; label: string; badge: string }[] = [
    { role: 'super_admin', label: 'Srikanth Verma (IAS)', badge: 'Super Admin' },
    { role: 'control_operator', label: 'Ananya Reddy', badge: 'Control Operator' },
    { role: 'police_responder', label: 'Inspector K. Prasad', badge: 'Police Responder' },
    { role: 'medical_responder', label: 'Dr. M. Swamy', badge: 'Medical Responder' },
    { role: 'fire_responder', label: 'S. Ramana', badge: 'River Rescue' },
    { role: 'pilgrim', label: 'Venkatesh Naidu', badge: 'Pilgrim User' },
  ];

  return (
    <header className="relative z-50 bg-slate-900 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8 h-16">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:border-teal-400 transition-colors">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              GODAVARI RAKSHA
              <span className="text-[11px] font-mono text-teal-400 font-normal">Pushkaralu 2027</span>
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveView('command')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 relative ${
              activeView === 'command' ? 'text-teal-400 font-semibold' : ''
            }`}
          >
            Command Centre
            {kpis.criticalAlerts > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-red-600 text-white text-[10px] font-mono rounded">
                {kpis.criticalAlerts}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveView('gis')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 ${
              activeView === 'gis' ? 'text-teal-400 font-semibold' : ''
            }`}
          >
            Live GIS Map
          </button>

          <button
            onClick={() => setActiveView('digital_twin')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 ${
              activeView === 'digital_twin' ? 'text-teal-400 font-semibold' : ''
            }`}
          >
            Digital Twin 3D
          </button>

          <button
            onClick={() => setActiveView('pilgrim')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 ${
              activeView === 'pilgrim' ? 'text-teal-400 font-semibold' : ''
            }`}
          >
            Pilgrim Mobile App
          </button>

          <button
            onClick={() => setActiveView('responder')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 ${
              activeView === 'responder' ? 'text-teal-400 font-semibold' : ''
            }`}
          >
            Field Responder
          </button>
        </nav>

        {/* Zone 3: 1 primary action / Role Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setLangMenuOpen(!langMenuOpen);
                setRoleMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
                <button
                  onClick={() => { setLanguage('en'); setLangMenuOpen(false); }}
                  className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-slate-800 ${language === 'en' ? 'text-teal-400 font-semibold' : 'text-slate-200'}`}
                >
                  English
                  {language === 'en' && <Check className="w-3.5 h-3.5 text-teal-400" />}
                </button>
                <button
                  onClick={() => { setLanguage('te'); setLangMenuOpen(false); }}
                  className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-slate-800 ${language === 'te' ? 'text-teal-400 font-semibold' : 'text-slate-200'}`}
                >
                  తెలుగు (Telugu)
                  {language === 'te' && <Check className="w-3.5 h-3.5 text-teal-400" />}
                </button>
                <button
                  onClick={() => { setLanguage('hi'); setLangMenuOpen(false); }}
                  className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-slate-800 ${language === 'hi' ? 'text-teal-400 font-semibold' : 'text-slate-200'}`}
                >
                  हिन्दी (Hindi)
                  {language === 'hi' && <Check className="w-3.5 h-3.5 text-teal-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Role Switcher Primary CTA */}
          <div className="relative">
            <button
              onClick={() => {
                setRoleMenuOpen(!roleMenuOpen);
                setLangMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-100 bg-teal-600 hover:bg-teal-500 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              <span className="truncate max-w-[120px] sm:max-w-[160px]">{currentUser.name}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80 shrink-0" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-2 z-50">
                <div className="px-3 pb-2 mb-1 border-b border-slate-800 text-[11px] text-slate-400 font-medium">
                  Switch Active Role (Demo Mode)
                </div>
                {roles.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => {
                      switchUserRole(item.role);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                      currentUser.role === item.role ? 'bg-slate-800 text-teal-400 font-medium' : 'text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-white font-medium">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.badge}</div>
                    </div>
                    {currentUser.role === item.role && <Check className="w-4 h-4 text-teal-400 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
