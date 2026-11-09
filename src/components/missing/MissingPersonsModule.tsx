/**
 * Godavari Raksha - Missing & Vulnerable Person Assistance (Module 18)
 * Consent-Based Manual Verification & Family Reunification Workflow
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MissingPersonReport } from '../../types';
import {
  Search,
  Users,
  CheckCircle,
  Phone,
  Clock,
  MapPin,
  AlertTriangle,
  UserCheck,
  Plus,
  Shield,
} from 'lucide-react';

export const MissingPersonsModule: React.FC = () => {
  const { missingPersons, reportMissingPerson, reuniteMissingPerson } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState<'CHILD' | 'MALE' | 'FEMALE' | 'OTHER'>('CHILD');
  const [newDesc, setNewDesc] = useState('');
  const [newLoc, setNewLoc] = useState('Pushkar Ghat Stairs');
  const [newContact, setNewContact] = useState('+91 98480 12345');

  const filtered = missingPersons.filter((m) => {
    if (filterStatus !== 'all' && m.status !== filterStatus) return false;
    return true;
  });

  const handleCreate = async () => {
    if (!newName) return;
    await reportMissingPerson({
      name: newName,
      approxAge: Number(newAge) || 8,
      gender: newGender,
      clothingDescription: newDesc || 'Not specified',
      lastSeenLocation: newLoc,
      lastSeenTime: new Date().toISOString(),
      contactPerson: 'Family Escort',
      contactPhone: newContact,
    });
    setShowAddModal(false);
    setNewName('');
    setNewDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
            Module 18 · Vulnerable Person Protection
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Missing & Vulnerable Person Assistance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Secure lost-and-found coordination across 12 police help desks, QR safety passes, and manual reunification.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-md text-xs font-semibold shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Register Missing Report</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs">
        {['all', 'SEARCH_IN_PROGRESS', 'SPOTTED', 'REUNITED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterStatus === st
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            {st === 'all' ? 'All Cases' : st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((person) => {
          let statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
          if (person.status === 'REUNITED') statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
          else if (person.status === 'SPOTTED') statusColor = 'text-teal-400 bg-teal-500/10 border-teal-500/30';

          return (
            <div
              key={person.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono text-teal-400 font-bold">{person.id}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {person.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Age ~{person.approxAge}y · Category: {person.gender}
                  </div>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusColor}`}>
                  {person.status}
                </span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300">
                <span className="text-slate-400 block text-[11px]">Clothing & Identification:</span>
                <p className="mt-0.5">{person.clothingDescription}</p>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <div>Last Seen: <span className="text-slate-200">📍 {person.lastSeenLocation}</span></div>
                <div>Guardian Contact: <a href={`tel:${person.contactPhone}`} className="text-teal-400 hover:underline font-mono">{person.contactPhone}</a></div>
                {person.caseNotes && (
                  <div className="text-slate-300 italic text-[11px] bg-slate-800/40 p-1.5 rounded mt-1">
                    "{person.caseNotes}"
                  </div>
                )}
              </div>

              {/* Reunification Action Button */}
              {person.status !== 'REUNITED' && (
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => reuniteMissingPerson(person.id, 'Verified via QR Safety wristband and family photo match')}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Confirm Family Reunification</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Report Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 shadow-2xl text-slate-100 animate-in fade-in">
            <h3 className="text-sm font-bold text-white mb-3">
              Register Missing Person Report
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Master Rohan"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Approximate Age:</label>
                  <input
                    type="number"
                    placeholder="e.g. 6"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Category:</label>
                  <select
                    value={newGender}
                    onChange={(e: any) => setNewGender(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="CHILD">Child</option>
                    <option value="FEMALE">Female / Elderly</option>
                    <option value="MALE">Male / Elderly</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Clothing & Appearance:</label>
                <textarea
                  placeholder="e.g. Yellow cartoon shirt, blue sandals, silver bracelet"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white h-20"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Contact Phone:</label>
                <input
                  type="text"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded"
              >
                Broadcast to Help Desks
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
