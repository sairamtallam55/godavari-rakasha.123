/**
 * Godavari Raksha - Smart Public Announcement Network (Module 20)
 * Multilingual Public Address Audio Console (Telugu, Hindi, English) with Geographic Zone Targeting
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Volume2, Radio, Send, Play, CheckCircle, Globe, AlertTriangle } from 'lucide-react';

export const PublicAnnouncementConsole: React.FC = () => {
  const { announcements, postAnnouncement, playAlertSound } = useApp();
  const [title, setTitle] = useState('');
  const [messageText, setMessageText] = useState('');
  const [language, setLanguage] = useState<'all' | 'telugu' | 'hindi' | 'english'>('all');
  const [targetZone, setTargetZone] = useState('All Ghats');
  const [priority, setPriority] = useState<'EMERGENCY' | 'ADVISORY' | 'INFO'>('EMERGENCY');
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  const zones = ['All Ghats', 'Pushkar Sector', 'Kotilingala Sector', 'Saraswathi Bay', 'Holding Grounds', 'Danavaipeta Arterial'];

  const templates = [
    {
      title: 'Crowd Diversion to Gate 3',
      text: 'గౌరవనీయ భక్తులకు విజ్ఞప్తి: గేట్ 2 వద్ద రద్దీ ఎక్కువగా ఉన్నందున భక్తులు గేట్ 3 వైపు మళ్లవలసిందిగా కోరుతున్నాము. Attention Pilgrims: High crowd density at Gate 2. Please proceed to Gate 3.',
      zone: 'Kotilingala Sector',
      priority: 'EMERGENCY' as const,
    },
    {
      title: 'River Deep Water Safety Warning',
      text: 'భక్తులు ఎవరూ ఎరుపు రంగు రక్షణ తాడును దాటి లోతైన నీటిలోకి వెళ్లరాదు. Do not cross the red buoy safety barrier. River current is strong.',
      zone: 'All Ghats',
      priority: 'ADVISORY' as const,
    },
    {
      title: 'Lost Child Assistance Announcement',
      text: '6 సంవత్సరాల బాలుడు పసుపు రంగు టీషర్ట్ ధరించి ఉన్నాడు. సమాచారం తెలిసినవారు సమీప పోలీస్ సహాయ కేంద్రానికి తెలియజేయండి.',
      zone: 'Saraswathi Bay',
      priority: 'EMERGENCY' as const,
    },
  ];

  const handleBroadcast = async () => {
    if (!messageText) return;
    await postAnnouncement({
      title: title || 'Public Safety Broadcast',
      messageText,
      language,
      targetZones: [targetZone],
      priority,
    });
    setTitle('');
    setMessageText('');
  };

  const handleSimulateTts = (id: string, text: string) => {
    setIsPlayingAudio(id);
    playAlertSound('alert');
    // Use Web Speech API if supported
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 160));
      utterance.onend = () => setIsPlayingAudio(null);
      utterance.onerror = () => setIsPlayingAudio(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(null), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
            Module 20 · Public Address Coordination
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Smart Public Announcement Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Broadcast life-saving Telugu, Hindi, and English announcements to IP speaker arrays across Rajamahendravaram.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400">
          <Radio className="w-4 h-4 text-emerald-400" />
          <span>48 IP PA Speakers Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Broadcast Composer (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-teal-400" />
            Create Public Safety Broadcast
          </h3>

          {/* Quick Preset Templates */}
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1.5">
              Rapid Emergency Templates:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {templates.map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTitle(tpl.title);
                    setMessageText(tpl.text);
                    setTargetZone(tpl.zone);
                    setPriority(tpl.priority);
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors border border-slate-700/60"
                >
                  {tpl.title}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Title / Internal Reference:</label>
              <input
                type="text"
                placeholder="e.g. Kotilingala Crowd Diversion"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                Announcement Script (Telugu, Hindi, or English):
              </label>
              <textarea
                placeholder="Type or paste the announcement audio text here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white h-24 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Target Zone:</label>
                <select
                  value={targetZone}
                  onChange={(e) => setTargetZone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                >
                  {zones.map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Language Mode:</label>
                <select
                  value={language}
                  onChange={(e: any) => setLanguage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                >
                  <option value="all">Multilingual (All)</option>
                  <option value="telugu">తెలుగు (Telugu)</option>
                  <option value="hindi">हिन्दी (Hindi)</option>
                  <option value="english">English</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Priority Level:</label>
                <select
                  value={priority}
                  onChange={(e: any) => setPriority(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                >
                  <option value="EMERGENCY">Emergency (Siren Intercept)</option>
                  <option value="ADVISORY">Advisory Caution</option>
                  <option value="INFO">General Information</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => handleSimulateTts('preview', messageText || 'Sample preview')}
                disabled={!messageText}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded text-xs transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-teal-400" />
                <span>{isPlayingAudio === 'preview' ? 'Playing Audio...' : 'Audio Preview (TTS)'}</span>
              </button>

              <button
                onClick={handleBroadcast}
                disabled={!messageText}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded text-xs font-bold shadow transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Broadcast</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Broadcast History (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-teal-400" />
            Broadcast Log & Active Transmissions
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-teal-400 font-bold">{ann.id}</span>
                    <h4 className="text-xs font-bold text-white mt-0.5">{ann.title}</h4>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      ann.priority === 'EMERGENCY'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {ann.priority}
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {ann.messageText}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Zones: {ann.targetZones.join(', ')}</span>
                  <button
                    onClick={() => handleSimulateTts(ann.id, ann.messageText)}
                    className="text-teal-400 hover:underline flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" />
                    <span>Play Audio</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
