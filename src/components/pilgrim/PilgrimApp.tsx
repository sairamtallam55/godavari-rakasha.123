/**
 * Godavari Raksha - Public and Pilgrim Mobile Application (Part 5 & Modules 02, 14, 15, 16)
 * Mobile-First Pilgrim Safety Interface with One-Tap SOS, Family Connect, QR Safety ID, and Multilingual Assistant
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IncidentCategory } from '../../types';
import { apiClient } from '../../services/api';
import {
  ShieldAlert,
  AlertCircle,
  Users,
  QrCode,
  Search,
  MessageSquare,
  Phone,
  MapPin,
  Send,
  HeartHandshake,
  CheckCircle,
  Volume2,
  Mic,
  Camera,
  Navigation,
  Share2,
  Sparkles,
} from 'lucide-react';

export const PilgrimApp: React.FC = () => {
  const {
    ghats,
    facilities,
    announcements,
    familyGroups,
    incidents,
    currentUser,
    language,
    triggerSos,
    createFamilyGroup,
    reportMissingPerson,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'home' | 'sos' | 'family' | 'qr' | 'missing' | 'ai_assistant' | 'my_requests' | 'nearby_maps'>('home');
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory>('medical');
  const [selectedGhat, setSelectedGhat] = useState<string>(ghats[0]?.name || 'Pushkar Ghat');
  const [sosDetails, setSosDetails] = useState('');
  const [isSubmittingSos, setIsSubmittingSos] = useState(false);
  const [sosSuccessId, setSosSuccessId] = useState<string | null>(null);

  // Google Maps Search via Gemini API Key
  const [mapQuery, setMapQuery] = useState('');
  const [mapLoading, setMapLoading] = useState(false);
  const [mapResults, setMapResults] = useState<{ summary?: string; quotaNotice?: boolean; places: Array<{ title: string; uri: string; address?: string; coordinates?: { lat: number; lng: number } }> } | null>(null);

  // Multilingual AI Assistant state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text:
        language === 'te'
          ? 'నమస్కారం! నేను గోదావరి రక్ష AI అసిస్టెంట్. మీకు ఎలా సహాయపడగలను? (అత్యవసర వైద్యం, సమీప ఘాట్, కుటుంబ భద్రత).'
          : language === 'hi'
          ? 'नमस्ते! मैं गोदावरी रक्षा एआई सहायक हूं। मैं आपकी क्या मदद कर सकता हूं?'
          : 'Namaste! I am the Godavari Raksha Safety Assistant. How can I assist you during Godavari Pushkaralu 2027?',
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Missing person report state
  const [missingName, setMissingName] = useState('');
  const [missingAge, setMissingAge] = useState('');
  const [missingDesc, setMissingDesc] = useState('');
  const [missingContact, setMissingContact] = useState(currentUser.phone);

  // Handle SOS trigger
  const handleTriggerSos = async () => {
    setIsSubmittingSos(true);
    try {
      const created = await triggerSos({
        category: selectedCategory,
        title: `Pilgrim Emergency SOS (${selectedCategory.toUpperCase()})`,
        description: sosDetails || `Emergency reported by ${currentUser.name} at ${selectedGhat}.`,
        locationName: `${selectedGhat} Bathing Bay`,
      });
      setSosSuccessId(created.id);
      setIsSubmittingSos(false);
    } catch (e) {
      setIsSubmittingSos(false);
    }
  };

  // Send AI chat message
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await apiClient.sendAiChat(userMsg, language, 'pilgrim');
      setChatMessages((prev) => [...prev, { sender: 'assistant', text: res.response }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: 'Emergency guidance: Contact nearest police help desk or dial 112.' },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const myReportedIncidents = incidents.filter(
    (i) => i.reporter?.phone === currentUser.phone || i.reporter?.name === currentUser.name
  );

  return (
    <div className="max-w-md mx-auto min-h-[calc(100vh-7.5rem)] bg-slate-900 border-x border-slate-800 flex flex-col shadow-2xl text-slate-100">
      
      {/* Pilgrim Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white leading-tight">
              {language === 'te' ? 'గోదావరి రక్ష' : language === 'hi' ? 'गोदावरी रक्षा' : 'GODAVARI RAKSHA'}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Pilgrim Safety Companion · {currentUser.name}
            </div>
          </div>
        </div>

        {/* 112 Emergency Call Pill */}
        <a
          href="tel:112"
          className="flex items-center gap-1 px-2.5 py-1 bg-red-600/90 hover:bg-red-500 text-white rounded text-[11px] font-bold shadow-sm transition-colors"
        >
          <Phone className="w-3 h-3" />
          <span>DIAL 112</span>
        </a>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            
            {/* Massive ONE-TAP SOS Launcher Card */}
            <div className="bg-gradient-to-b from-red-950/40 to-slate-900 border border-red-500/40 rounded-2xl p-5 text-center shadow-xl">
              <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
                {language === 'te' ? 'తక్షణ అత్యవసర సహాయం' : 'Emergency Assistance'}
              </span>
              <p className="text-xs text-slate-300 mt-1">
                Tap to transmit your exact GPS location to the RMC Command Room
              </p>

              <button
                onClick={() => setActiveTab('sos')}
                className="mt-4 w-28 h-28 mx-auto rounded-full bg-red-600 hover:bg-red-500 active:scale-95 border-4 border-red-400/50 shadow-2xl flex flex-col items-center justify-center text-white transition-all transform"
              >
                <ShieldAlert className="w-9 h-9" />
                <span className="text-base font-extrabold tracking-wider mt-1">SOS</span>
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>GPS Location: Pushkar Ghat Sector (Captured)</span>
              </div>
            </div>

            {/* Official Safety Announcements Ticker */}
            {announcements.length > 0 && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1.5">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>Public Announcement</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {announcements[0].messageText}
                </p>
                <div className="text-[10px] text-slate-500 mt-1">
                  Broadcast by {announcements[0].author}
                </div>
              </div>
            )}

            {/* Ghats Bathing Safety Status */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Pushkaralu Bathing Ghats Status
                </span>
                <span className="text-[11px] text-slate-400">8 Holy Ghats</span>
              </div>

              <div className="space-y-2">
                {ghats.slice(0, 4).map((ghat) => (
                  <div
                    key={ghat.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {ghat.name}
                        <span className="text-[10px] font-normal text-slate-400">({ghat.teluguName})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Water: {ghat.waterDepthMeters}m · Flow: {ghat.riverFlowVelocityMps}m/s
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          ghat.crowdRiskLevel === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : ghat.crowdRiskLevel === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {ghat.crowdRiskLevel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Service Cards */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => setActiveTab('family')}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left hover:border-teal-500/50 transition-colors"
              >
                <Users className="w-5 h-5 text-teal-400 mb-1.5" />
                <div className="text-xs font-bold text-white">Family Connect</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Keep track of loved ones</div>
              </button>

              <button
                onClick={() => setActiveTab('qr')}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left hover:border-teal-500/50 transition-colors"
              >
                <QrCode className="w-5 h-5 text-teal-400 mb-1.5" />
                <div className="text-xs font-bold text-white">QR Safety ID</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Emergency identity pass</div>
              </button>

              <button
                onClick={() => setActiveTab('missing')}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left hover:border-teal-500/50 transition-colors"
              >
                <Search className="w-5 h-5 text-amber-400 mb-1.5" />
                <div className="text-xs font-bold text-white">Lost & Found</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Report separated person</div>
              </button>

              <button
                onClick={() => setActiveTab('ai_assistant')}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left hover:border-teal-500/50 transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-teal-400 mb-1.5" />
                <div className="text-xs font-bold text-white">AI Assistant</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Telugu / Hindi / English</div>
              </button>

              <button
                onClick={() => setActiveTab('nearby_maps')}
                className="col-span-2 p-3.5 bg-gradient-to-r from-teal-950/40 to-slate-950 border border-teal-500/40 rounded-xl text-left hover:border-teal-400 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Google Maps Navigation</div>
                    <div className="text-[10px] text-teal-300">Nearest hospitals, water posts, ghats (Gemini Key)</div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-teal-400">Open ↗</span>
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: ONE-TAP SOS INTERACTION */}
        {activeTab === 'sos' && (
          <div className="space-y-4">
            <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                Emergency Category Selection
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Select the type of emergency for immediate specialized dispatch:
              </p>

              {/* Categories */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {[
                  { id: 'medical', label: '🚑 Medical / Fainting' },
                  { id: 'accident', label: '⚠️ Fall / Injury' },
                  { id: 'crowd_danger', label: '👥 Crowd Surge' },
                  { id: 'river_rescue', label: '🌊 River Rescue' },
                  { id: 'fire', label: '🔥 Fire / Smoke' },
                  { id: 'missing_person', label: '🔍 Lost Child / Person' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as IncidentCategory)}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-red-600 text-white border-red-500 shadow-sm'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Location Picker */}
              <div className="mt-3">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Current Location:
                </label>
                <select
                  value={selectedGhat}
                  onChange={(e) => setSelectedGhat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  {ghats.map((g) => (
                    <option key={g.id} value={g.name}>
                      {g.name} ({g.teluguName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Description (Optional) */}
              <div className="mt-3">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Additional Details (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Staircase 4, person is diabetic"
                  value={sosDetails}
                  onChange={(e) => setSosDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Confirm SOS Button */}
              <button
                onClick={handleTriggerSos}
                disabled={isSubmittingSos}
                className="mt-4 w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-sm shadow-xl transition-transform active:scale-98 flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-5 h-5" />
                <span>{isSubmittingSos ? 'Broadcasting SOS...' : 'TRANSMIT SOS NOW'}</span>
              </button>

              {sosSuccessId && (
                <div className="mt-3 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-xs text-emerald-200">
                  <div className="font-bold">SOS Registered! ID: #{sosSuccessId}</div>
                  <div className="mt-0.5">Control room operator notified. Stand by near your position.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: FAMILY SAFETY & GROUP CONNECT */}
        {activeTab === 'family' && (
          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                Family Safety Network
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Stay connected with family members in crowded Pushkaralu grounds with consent-based GPS.
              </p>

              {familyGroups.length > 0 && (
                <div className="mt-3 space-y-3">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{familyGroups[0].groupName}</span>
                      <span className="text-[11px] font-mono bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded">
                        Code: {familyGroups[0].joinCode}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Meeting Point: <span className="text-slate-200 font-medium">{familyGroups[0].meetingPointName}</span>
                    </div>

                    {/* Member List */}
                    <div className="mt-3 space-y-2 border-t border-slate-800 pt-2.5">
                      {familyGroups[0].members.map((mem) => (
                        <div key={mem.id} className="flex items-center justify-between text-xs">
                          <div>
                            <span className="text-white font-medium">{mem.name}</span>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Battery: {mem.batteryLevel || 75}% · Sharing: {mem.sharingLocation ? 'Active' : 'Off'}
                            </div>
                          </div>
                          <span className="text-[11px] font-mono text-emerald-400">Connected</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: QR SAFETY ID */}
        {activeTab === 'qr' && (
          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center">
              <h3 className="text-sm font-bold text-white">Temporary Pushkaralu Safety Pass</h3>
              <p className="text-xs text-slate-400 mt-1">
                Authorized help desks can scan this pass if separated
              </p>

              {/* Procedural QR Display */}
              <div className="my-5 w-44 h-44 mx-auto bg-white p-3 rounded-xl shadow-2xl flex flex-col items-center justify-center">
                <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-slate-100 rounded">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        i % 2 === 0 || i === 0 || i === 5 || i === 30 || i === 35
                          ? 'bg-slate-950'
                          : 'bg-teal-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-xs font-mono font-bold text-teal-400">
                PASSPORT-ID: PSK-2027-{currentUser.id.toUpperCase().slice(-6)}
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Name: {currentUser.name} · Phone: {currentUser.phone}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MISSING PERSONS */}
        {activeTab === 'missing' && (
          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-400" />
                Report Missing Child or Relative
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Instantly notifies all 12 help desks and police patrol squads with description.
              </p>

              <div className="mt-3 space-y-2.5">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Full Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Master Rohan"
                    value={missingName}
                    onChange={(e) => setMissingName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Approximate Age:</label>
                  <input
                    type="number"
                    placeholder="e.g. 7"
                    value={missingAge}
                    onChange={(e) => setMissingAge(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Clothing & Appearance:</label>
                  <input
                    type="text"
                    placeholder="e.g. Yellow t-shirt, blue shorts, last seen near Kotilingala stairs"
                    value={missingDesc}
                    onChange={(e) => setMissingDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white"
                  />
                </div>

                <button
                  onClick={() => {
                    if (!missingName) return;
                    reportMissingPerson({
                      name: missingName,
                      approxAge: Number(missingAge) || 10,
                      clothingDescription: missingDesc,
                      lastSeenLocation: 'Pushkar Ghat Area',
                      contactPerson: currentUser.name,
                      contactPhone: missingContact,
                    });
                    setMissingName('');
                    setMissingDesc('');
                  }}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold transition-colors mt-2"
                >
                  Broadcast Missing Person Alert
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: MULTILINGUAL AI ASSISTANT */}
        {activeTab === 'ai_assistant' && (
          <div className="flex flex-col h-[480px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                Gemini Multilingual Copilot
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">
                Lang: {language}
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2.5 rounded-lg leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-teal-600 text-white rounded-br-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="text-[11px] text-slate-400 italic">
                  Retrieving safety coordinates and guidance...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-2 border-t border-slate-800 flex items-center gap-1.5 bg-slate-900">
              <input
                type="text"
                placeholder={language === 'te' ? 'మీ ప్రశ్నను ఇక్కడ అడగండి...' : 'Ask about ghats, water, medical tents...'}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <button
                onClick={handleSendChat}
                className="p-2 bg-teal-600 hover:bg-teal-500 text-white rounded transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 7: MY REQUESTS */}
        {activeTab === 'my_requests' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              My Reported Incidents & Requests
            </h3>
            {myReportedIncidents.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                You have not submitted any active emergency reports.
              </div>
            ) : (
              myReportedIncidents.map((req) => (
                <div key={req.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs">
                  <div className="flex justify-between font-mono font-bold">
                    <span className="text-teal-400">{req.id}</span>
                    <span className="text-amber-400">{req.status}</span>
                  </div>
                  <div className="text-white font-medium mt-1">{req.title}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">📍 {req.locationName}</div>
                  {req.responseNotes && (
                    <div className="mt-2 text-slate-300 bg-slate-900 p-2 rounded border border-slate-800 text-[11px]">
                      Officer Notes: {req.responseNotes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 8: GOOGLE MAPS NAVIGATION (GEMINI KEY) */}
        {activeTab === 'nearby_maps' && (
          <div className="space-y-4">
            <div className="bg-slate-950 border border-teal-500/40 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">
                  Google Maps Location & Navigation
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Powered by Gemini API Key with live Google Maps grounding for Rajamahendravaram.
              </p>

              {/* Search Box */}
              <div className="mt-3 flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. Nearest medical camp, Pushkar Ghat, GGH..."
                  value={mapQuery}
                  onChange={(e) => setMapQuery(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && mapQuery.trim()) {
                      setMapLoading(true);
                      try {
                        const res = await apiClient.searchGoogleMaps(mapQuery.trim());
                        setMapResults(res);
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setMapLoading(false);
                      }
                    }
                  }}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white"
                />
                <button
                  onClick={async () => {
                    if (!mapQuery.trim()) return;
                    setMapLoading(true);
                    try {
                      const res = await apiClient.searchGoogleMaps(mapQuery.trim());
                      setMapResults(res);
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setMapLoading(false);
                    }
                  }}
                  disabled={mapLoading || !mapQuery.trim()}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded text-xs font-semibold"
                >
                  {mapLoading ? '...' : 'Search'}
                </button>
              </div>

              {/* Quick Shortcuts */}
              <div className="flex flex-wrap gap-1 mt-2">
                {[
                  'Nearest Hospital',
                  'Drinking Water Camp',
                  'Kotilingala Ghat Entrance',
                  'Central Police Help Desk',
                ].map((sc) => (
                  <button
                    key={sc}
                    onClick={async () => {
                      setMapQuery(sc);
                      setMapLoading(true);
                      try {
                        const res = await apiClient.searchGoogleMaps(sc);
                        setMapResults(res);
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setMapLoading(false);
                      }
                    }}
                    className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-[10px] font-medium border border-slate-800"
                  >
                    {sc}
                  </button>
                ))}
              </div>

              {/* Results */}
              {mapResults && (
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs">
                  {mapResults.quotaNotice && (
                    <div className="p-2 bg-teal-950/40 border border-teal-500/40 rounded text-[11px] text-teal-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>Verified Pushkaralu spatial directory & live Google Maps links active.</span>
                    </div>
                  )}

                  {mapResults.summary && (
                    <div className="p-2.5 bg-slate-900 rounded text-[11px] text-slate-200 leading-relaxed border border-slate-800">
                      {mapResults.summary}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    {mapResults.places.map((place, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-slate-900 border border-slate-800 rounded flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-semibold text-white">{place.title}</div>
                          {place.address && (
                            <div className="text-[10px] text-slate-400">{place.address}</div>
                          )}
                        </div>
                        <a
                          href={place.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded text-[11px] font-bold flex items-center gap-1 shrink-0"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Navigate ↗</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="bg-slate-950 border-t border-slate-800 grid grid-cols-5 p-1 text-[10px] text-slate-400">
        <button
          onClick={() => setActiveTab('home')}
          className={`py-2 flex flex-col items-center gap-0.5 ${activeTab === 'home' ? 'text-teal-400 font-semibold' : 'hover:text-slate-200'}`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('family')}
          className={`py-2 flex flex-col items-center gap-0.5 ${activeTab === 'family' ? 'text-teal-400 font-semibold' : 'hover:text-slate-200'}`}
        >
          <Users className="w-4 h-4" />
          <span>Family</span>
        </button>

        <button
          onClick={() => setActiveTab('sos')}
          className="py-1 flex flex-col items-center gap-0.5 text-red-500 font-bold -mt-2"
        >
          <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
            SOS
          </div>
        </button>

        <button
          onClick={() => setActiveTab('ai_assistant')}
          className={`py-2 flex flex-col items-center gap-0.5 ${activeTab === 'ai_assistant' ? 'text-teal-400 font-semibold' : 'hover:text-slate-200'}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>AI Help</span>
        </button>

        <button
          onClick={() => setActiveTab('my_requests')}
          className={`py-2 flex flex-col items-center gap-0.5 ${activeTab === 'my_requests' ? 'text-teal-400 font-semibold' : 'hover:text-slate-200'}`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>Status</span>
        </button>
      </div>

    </div>
  );
};
