/**
 * Godavari Raksha - AI CCTV Detection Centre (Module 07)
 * Multimodal Computer Vision Video-Frame Analysis with Gemini & Operator Verification Pipeline
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AiCctvAlert } from '../../types';
import { apiClient } from '../../services/api';
import {
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  Eye,
  RefreshCw,
} from 'lucide-react';

export const AiCctvCentre: React.FC = () => {
  const { aiAlerts, convertAiAlertToIncident, rejectAiAlert, verifyAiAlert } = useApp();

  const [selectedCamera, setSelectedCamera] = useState<string>('CAM-KOTI-04');
  const [analyzing, setAnalyzing] = useState(false);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<any>(null);
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);

  const cameras = [
    { id: 'CAM-KOTI-04', name: 'Kotilingala Lower Stairs West', zone: 'Kotilingala Ghat' },
    { id: 'CAM-PUSH-02', name: 'Pushkar Ghat Tower Overview', zone: 'Pushkar Ghat' },
    { id: 'CAM-SARA-01', name: 'Saraswathi River Barrier North', zone: 'Saraswathi Ghat' },
    { id: 'CAM-RAIL-01', name: 'Havelock Rail Bridge Base Pier 4', zone: 'Havelock View' },
    { id: 'CAM-MARK-03', name: 'Markandeya Temple Corridor', zone: 'Markandeya Ghat' },
  ];

  // Handle sample simulated frame analysis
  const handleAnalyzeFrame = async () => {
    setAnalyzing(true);
    setLastAnalysisResult(null);

    const cam = cameras.find((c) => c.id === selectedCamera) || cameras[0];

    // Minimal base64 1x1 test pixel or simulated frame
    const dummyBase64 = customImagePreview
      ? customImagePreview.split(',')[1]
      : 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    try {
      const res = await apiClient.analyzeCctvFrame(dummyBase64, cam.zone, cam.id);
      setLastAnalysisResult(res);
      setAnalyzing(false);
    } catch (err) {
      console.error('Analysis error:', err);
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCustomImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
            Module 07 · Computer Vision Intelligence
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            AI CCTV Detection Centre
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multimodal crowd density, motionless person, and river boundary anomaly detection.
          </p>
        </div>

        {/* Workflow Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
          <span className="text-teal-400 font-semibold">Workflow:</span>
          <span>DETECTED → PENDING REVIEW → HUMAN VERIFICATION → INCIDENT</span>
        </div>
      </div>

      {/* Main Grid: Live Camera Stream Workspace + AI Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Camera Video Feed Simulation & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            {/* Stream Header */}
            <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-white">
                  {cameras.find((c) => c.id === selectedCamera)?.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400">({selectedCamera})</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  STREAMING 25 FPS
                </span>
              </div>
            </div>

            {/* Video Canvas Simulation */}
            <div className="relative aspect-video bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden group">
              
              {customImagePreview ? (
                <img
                  src={customImagePreview}
                  alt="CCTV Frame"
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="w-full h-full relative border border-slate-800/80 rounded flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
                  
                  {/* Procedural CCTV Grid Lines & Overlays */}
                  <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 opacity-15 pointer-events-none">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="border border-teal-500/40"></div>
                    ))}
                  </div>

                  {/* Simulated Detected Bounding Box */}
                  <div className="absolute top-1/4 left-1/3 w-32 h-28 border-2 border-red-500 rounded bg-red-500/10 flex flex-col justify-between p-1">
                    <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/80 px-1 rounded">
                      CROWD SURGE (5.4/m²)
                    </span>
                    <span className="text-[9px] font-mono text-white/80 self-end">
                      Conf: 94%
                    </span>
                  </div>

                  <div className="text-center z-10">
                    <Camera className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                    <div className="text-xs font-mono text-slate-400">
                      LIVE SIMULATED OPTICAL FEED · RAJAMAHENDRAVARAM RMC
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {cameras.find((c) => c.id === selectedCamera)?.zone}
                    </div>
                  </div>

                  {/* Timestamp Watermark */}
                  <div className="absolute bottom-2 left-3 font-mono text-[10px] text-teal-400/80">
                    UTC 2027-07-14T18:24:12.802 · SENSOR FPS: 30
                  </div>
                </div>
              )}

              {/* Upload Overlay Button */}
              <label className="absolute top-3 right-3 cursor-pointer px-2.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-md text-xs flex items-center gap-1.5 shadow-md transition-colors">
                <Upload className="w-3.5 h-3.5 text-teal-400" />
                <span>Upload Custom Frame</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

            </div>

            {/* Analysis Trigger Bar */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Active Camera:</span>
                <select
                  value={selectedCamera}
                  onChange={(e) => {
                    setSelectedCamera(e.target.value);
                    setCustomImagePreview(null);
                  }}
                  className="bg-slate-800 border border-slate-700 text-white text-xs rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  {cameras.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.zone})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAnalyzeFrame}
                disabled={analyzing}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-md text-xs font-semibold shadow-md transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                <span>{analyzing ? 'Inspecting Frame...' : 'Run Multimodal AI Inspection'}</span>
              </button>
            </div>

          </div>

          {/* Analysis Report Banner */}
          {lastAnalysisResult && (
            <div className="bg-slate-900 border border-teal-500/40 rounded-xl p-4 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between font-bold">
                <span className="text-teal-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Frame Analysis Completed ({lastAnalysisResult.mode})
                </span>
                <span className="font-mono text-slate-400">
                  Confidence: {((lastAnalysisResult.alert?.confidenceScore || 0.9) * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-slate-200 leading-relaxed">
                {lastAnalysisResult.alert?.summary}
              </p>
              {lastAnalysisResult.details?.recommendedAction && (
                <div className="text-amber-300 font-medium">
                  Recommendation: {lastAnalysisResult.details.recommendedAction}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column: AI Detected Alerts Queue & Human Verification Pipeline (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              AI Detection Review Pipeline ({aiAlerts.length})
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">
              Pending: {aiAlerts.filter((a) => a.status === 'PENDING_REVIEW').length}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {aiAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-teal-400">
                      {alert.id}
                    </span>
                    <div className="text-xs font-bold text-white mt-0.5">
                      {alert.category.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      📍 {alert.locationName} · {alert.cameraName}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono font-bold text-amber-400">
                      {(alert.confidenceScore * 100).toFixed(0)}% Conf
                    </span>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                      {alert.status}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {alert.summary}
                </p>

                {/* Operator Verification Action Bar */}
                {alert.status === 'PENDING_REVIEW' && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end gap-2">
                    <button
                      onClick={() => rejectAiAlert(alert.id)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition-colors"
                    >
                      Dismiss (False Positive)
                    </button>
                    <button
                      onClick={() => convertAiAlertToIncident(alert.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[11px] font-semibold transition-colors shadow-sm"
                    >
                      Verify & Create Incident
                    </button>
                  </div>
                )}

                {alert.status === 'CONVERTED_TO_INCIDENT' && (
                  <div className="pt-1.5 border-t border-slate-800/80 text-[11px] text-emerald-400 font-mono">
                    ✓ Converted into Active Emergency Incident
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
