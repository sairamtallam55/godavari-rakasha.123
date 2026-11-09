/**
 * Godavari Raksha - Live GIS Emergency Map (Module 04)
 * Interactive Leaflet + OpenStreetMap + GeoJSON GIS Map of Rajamahendravaram
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { Incident, GhatLocation, ResponseTeam, EmergencyFacility } from '../../types';
import {
  MapPin,
  Filter,
  Layers,
  Compass,
  AlertTriangle,
  Radio,
  Building2,
  Waves,
  Search,
  ExternalLink,
  Sparkles,
  Navigation,
} from 'lucide-react';
import { apiClient } from '../../services/api';

export const LiveGisMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const { ghats, incidents, responseTeams, facilities, verifyIncident } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showTeams, setShowTeams] = useState(true);
  const [showFacilities, setShowFacilities] = useState(true);
  const [showGhats, setShowGhats] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIncidentDetails, setActiveIncidentDetails] = useState<Incident | null>(null);

  // Gemini Google Maps Grounding state (powered by GEMINI_API_KEY)
  const [gmpQuery, setGmpQuery] = useState('');
  const [gmpLoading, setGmpLoading] = useState(false);
  const [gmpResults, setGmpResults] = useState<{ summary?: string; quotaNotice?: boolean; places: Array<{ title: string; uri: string; address?: string; coordinates?: { lat: number; lng: number } }> } | null>(null);
  const [showGmpDrawer, setShowGmpDrawer] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Initialize once

    // Initialize Leaflet Map centered on Rajamahendravaram Godavari Riverfront
    const map = L.map(mapContainerRef.current, {
      center: [16.9970, 81.7745],
      zoom: 14,
      zoomControl: true,
      attributionControl: false,
    });

    // Dark theme OpenStreetMap tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers whenever data or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    // 1. Ghat Locations (Polygon circles or specialized pins)
    if (showGhats) {
      ghats.forEach((ghat) => {
        let fillColor = '#10b981'; // LOW
        if (ghat.crowdRiskLevel === 'CRITICAL') fillColor = '#ef4444';
        else if (ghat.crowdRiskLevel === 'HIGH') fillColor = '#f97316';
        else if (ghat.crowdRiskLevel === 'MODERATE') fillColor = '#eab308';

        const circle = L.circle([ghat.coordinates.lat, ghat.coordinates.lng], {
          radius: 120,
          color: fillColor,
          fillColor,
          fillOpacity: 0.25,
          weight: 2,
        });

        const ghatIcon = L.divIcon({
          className: 'custom-ghat-marker',
          html: `<div style="background-color: ${fillColor}; color: white; padding: 3px 6px; border-radius: 4px; font-size: 11px; font-weight: 700; white-space: nowrap; border: 1px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.4);">
                  ${ghat.name} (${Math.round((ghat.currentCrowdCount / ghat.capacityPilgrims) * 100)}%)
                </div>`,
          iconSize: [120, 24],
          iconAnchor: [60, 12],
        });

        const marker = L.marker([ghat.coordinates.lat, ghat.coordinates.lng], { icon: ghatIcon });
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px;">
            <div style="font-weight: 700; font-size: 13px; color: #0284c7;">${ghat.name}</div>
            <div style="color: #64748b; font-size: 11px;">${ghat.teluguName}</div>
            <div style="margin-top: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
              <div>Crowd: <b>${ghat.currentCrowdCount.toLocaleString()}</b></div>
              <div>Capacity: <b>${ghat.capacityPilgrims.toLocaleString()}</b></div>
              <div>Water Depth: <b>${ghat.waterDepthMeters}m</b></div>
              <div>Flow Speed: <b>${ghat.riverFlowVelocityMps}m/s</b></div>
            </div>
            <div style="margin-top: 6px; font-size: 11px; color: #475569;">
              Exits: ${ghat.emergencyExits.join(', ')}
            </div>
          </div>
        `);

        layer.addLayer(circle);
        layer.addLayer(marker);
      });
    }

    // 2. Emergency Facilities
    if (showFacilities) {
      facilities.forEach((fac) => {
        let iconSymbol = '🏥';
        let bg = '#0284c7';
        if (fac.type === 'police_station') {
          iconSymbol = '🚓';
          bg = '#3b82f6';
        } else if (fac.type === 'fire_station') {
          iconSymbol = '🚒';
          bg = '#ea580c';
        } else if (fac.type === 'rescue_boat_dock') {
          iconSymbol = '🚤';
          bg = '#0d9488';
        }

        const facIcon = L.divIcon({
          className: 'custom-fac-marker',
          html: `<div style="background-color: ${bg}; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.5);">
                  ${iconSymbol}
                </div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const marker = L.marker([fac.coordinates.lat, fac.coordinates.lng], { icon: facIcon });
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px;">
            <div style="font-weight: 700; color: #0f172a;">${fac.name}</div>
            <div style="color: #64748b; font-size: 11px; margin-top: 2px;">${fac.locationName}</div>
            <div style="margin-top: 4px; font-size: 11px;">
              ${fac.availableBeds !== undefined ? `Available Beds: <b>${fac.availableBeds}</b> / ${fac.totalBeds}<br/>` : ''}
              ${fac.icuAvailable !== undefined ? `ICU Units: <b>${fac.icuAvailable}</b><br/>` : ''}
              Staff On Duty: <b>${fac.staffOnDuty}</b><br/>
              Phone: <b>${fac.contactPhone}</b>
            </div>
          </div>
        `);
        layer.addLayer(marker);
      });
    }

    // 3. Response Teams
    if (showTeams) {
      responseTeams.forEach((team) => {
        const isBusy = team.status === 'DISPATCHED' || team.status === 'ON_SCENE';
        const teamColor = isBusy ? '#f59e0b' : '#10b981';

        const teamIcon = L.divIcon({
          className: 'custom-team-marker',
          html: `<div style="background-color: ${teamColor}; color: white; padding: 2px 5px; border-radius: 3px; font-size: 10px; font-weight: 700; border: 1px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.4); white-space: nowrap;">
                  ${team.category === 'ambulance' ? '🚑' : team.category === 'water_rescue' ? '🚤' : '👮'} ${team.name.slice(0, 14)}..
                </div>`,
          iconSize: [100, 20],
          iconAnchor: [50, 10],
        });

        const marker = L.marker([team.coordinates.lat, team.coordinates.lng], { icon: teamIcon });
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px;">
            <div style="font-weight: 700; color: #0f172a;">${team.name}</div>
            <div style="color: #64748b; font-size: 11px;">Agency: ${team.agency} · Status: <b>${team.status}</b></div>
            <div style="margin-top: 4px; font-size: 11px;">
              Officer: <b>${team.leadOfficer}</b><br/>
              Phone: <b>${team.contactNumber}</b><br/>
              Location: <b>${team.currentLocationName}</b>
            </div>
          </div>
        `);
        layer.addLayer(marker);
      });
    }

    // 4. Live Incidents
    const filteredIncidents = incidents.filter((inc) => {
      if (selectedCategory !== 'all' && inc.category !== selectedCategory) return false;
      if (selectedPriority !== 'all' && inc.priority !== selectedPriority) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          inc.title.toLowerCase().includes(q) ||
          inc.locationName.toLowerCase().includes(q) ||
          inc.id.toLowerCase().includes(q)
        );
      }
      return true;
    });

    filteredIncidents.forEach((inc) => {
      let pinColor = '#ef4444'; // CRITICAL
      if (inc.priority === 'HIGH') pinColor = '#f97316';
      else if (inc.priority === 'MEDIUM') pinColor = '#eab308';
      else if (inc.priority === 'LOW') pinColor = '#3b82f6';

      const isResolved = inc.status === 'RESOLVED' || inc.status === 'CLOSED';
      if (isResolved) pinColor = '#10b981';

      const incIcon = L.divIcon({
        className: 'custom-inc-marker',
        html: `<div style="background-color: ${pinColor}; width: 24px; height: 24px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 0 10px ${pinColor}; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: 800;">
                !
              </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([inc.coordinates.lat, inc.coordinates.lng], { icon: incIcon });
      marker.on('click', () => {
        setActiveIncidentDetails(inc);
      });

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; max-width: 240px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
            <span style="font-weight: 700; color: #dc2626;">${inc.id}</span>
            <span style="font-size: 10px; background: #fee2e2; color: #991b1b; padding: 1px 4px; border-radius: 2px; font-weight: 600;">${inc.priority}</span>
          </div>
          <div style="font-weight: 600; color: #0f172a; margin-top: 2px;">${inc.title}</div>
          <div style="color: #64748b; font-size: 11px; margin-top: 2px;">📍 ${inc.locationName}</div>
          <div style="margin-top: 4px; font-size: 11px; color: #334155;">${inc.description}</div>
          <div style="margin-top: 6px; font-size: 11px; color: #047857; font-weight: 600;">
            Status: ${inc.status}
          </div>
        </div>
      `);

      layer.addLayer(marker);
    });
  }, [ghats, incidents, responseTeams, facilities, selectedCategory, selectedPriority, showTeams, showFacilities, showGhats, searchQuery]);

  return (
    <div className="relative w-full h-[calc(100vh-7.5rem)] min-h-[600px] flex flex-col bg-slate-950">
      
      {/* Top Filter and Search Bar */}
      <div className="z-10 bg-slate-900/90 border-b border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search incident, ghat, facility..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-md pl-8 pr-3 py-1.5 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* Filters and Google Maps Grounding Launcher */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">All Categories</option>
            <option value="medical">Medical</option>
            <option value="crowd_danger">Crowd Danger</option>
            <option value="river_rescue">River Rescue</option>
            <option value="fire">Fire</option>
            <option value="missing_person">Missing Person</option>
            <option value="accident">Accident</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">All Priorities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Layer Toggles */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-md border border-slate-700">
            <button
              onClick={() => setShowGhats(!showGhats)}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                showGhats ? 'bg-teal-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ghats ({ghats.length})
            </button>
            <button
              onClick={() => setShowTeams(!showTeams)}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                showTeams ? 'bg-teal-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Squads ({responseTeams.length})
            </button>
            <button
              onClick={() => setShowFacilities(!showFacilities)}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                showFacilities ? 'bg-teal-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hospitals ({facilities.length})
            </button>
          </div>

          {/* Google Maps Grounding Action Button (Powered by GEMINI_API_KEY) */}
          <button
            onClick={() => setShowGmpDrawer(!showGmpDrawer)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-md font-semibold text-xs shadow transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-200" />
            <span>Google Maps Grounding</span>
          </button>

        </div>

      </div>

      {/* Google Maps Grounding Drawer (Powered by GEMINI_API_KEY) */}
      {showGmpDrawer && (
        <div className="absolute top-16 left-4 z-30 w-96 max-w-[90vw] bg-slate-900/95 border border-teal-500/50 rounded-xl p-4 shadow-2xl backdrop-blur-md text-slate-100 animate-in fade-in">
          <div className="flex items-start justify-between pb-2 border-b border-slate-800">
            <div>
              <div className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Google Maps via Gemini API Key
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Live Google Maps Search & Navigation
              </h3>
            </div>
            <button
              onClick={() => setShowGmpDrawer(false)}
              className="text-slate-400 hover:text-white p-1 text-xs"
            >
              ✕
            </button>
          </div>

          {/* Search Box */}
          <div className="mt-3 flex items-center gap-1.5">
            <input
              type="text"
              placeholder="e.g. Nearest hospital to Pushkar Ghat, GGH..."
              value={gmpQuery}
              onChange={(e) => setGmpQuery(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter' && gmpQuery.trim()) {
                  setGmpLoading(true);
                  try {
                    const res = await apiClient.searchGoogleMaps(gmpQuery.trim());
                    setGmpResults(res);
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setGmpLoading(false);
                  }
                }
              }}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={async () => {
                if (!gmpQuery.trim()) return;
                setGmpLoading(true);
                try {
                  const res = await apiClient.searchGoogleMaps(gmpQuery.trim());
                  setGmpResults(res);
                } catch (err) {
                  console.error(err);
                } finally {
                  setGmpLoading(false);
                }
              }}
              disabled={gmpLoading || !gmpQuery.trim()}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-md text-xs font-semibold"
            >
              {gmpLoading ? '...' : 'Search'}
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap gap-1 mt-2">
            {[
              'Nearest Trauma Hospital',
              'Kotilingala Bathing Bay',
              'Pushkar Ghat Clock Tower',
              'SDRF Boat Dock Station',
            ].map((shortcut) => (
              <button
                key={shortcut}
                onClick={async () => {
                  setGmpQuery(shortcut);
                  setGmpLoading(true);
                  try {
                    const res = await apiClient.searchGoogleMaps(shortcut);
                    setGmpResults(res);
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setGmpLoading(false);
                  }
                }}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-medium"
              >
                {shortcut}
              </button>
            ))}
          </div>

          {/* Grounding Results Display */}
          {gmpResults && (
            <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2.5 max-h-72 overflow-y-auto text-xs">
              {gmpResults.quotaNotice && (
                <div className="p-2 bg-teal-950/40 border border-teal-500/40 rounded text-[11px] text-teal-300 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-teal-400 shrink-0" />
                  <span>Verified Google Maps links & spatial directory active.</span>
                </div>
              )}

              {gmpResults.summary && (
                <p className="text-slate-200 leading-relaxed text-[11px] bg-slate-950 p-2.5 rounded border border-slate-800">
                  {gmpResults.summary}
                </p>
              )}

              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                  Verified Google Maps Places:
                </span>
                {gmpResults.places.map((place: any, i: number) => (
                  <div
                    key={i}
                    className="p-2.5 bg-slate-950 rounded border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-white">{place.title}</div>
                      {place.address && (
                        <div className="text-[10px] text-slate-400">{place.address}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {place.coordinates && (
                        <button
                          onClick={() => {
                            mapInstanceRef.current?.flyTo([place.coordinates.lat, place.coordinates.lng], 16, { duration: 1.2 });
                          }}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded text-[10px] font-medium"
                          title="Center on Live GIS Map"
                        >
                          Pin 📍
                        </button>
                      )}
                      <a
                        href={place.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 font-semibold"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Maps ↗</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono text-center">
            Powered by Gemini API Key with Google Maps Grounding
          </div>
        </div>
      )}

      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full flex-1 z-0" />

      {/* Selected Incident Drawer (Flyout) */}
      {activeIncidentDetails && (
        <div className="absolute top-16 right-4 z-20 w-80 bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl text-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-red-400">
                {activeIncidentDetails.id}
              </span>
              <h4 className="text-sm font-semibold text-white mt-0.5">
                {activeIncidentDetails.title}
              </h4>
            </div>
            <button
              onClick={() => setActiveIncidentDetails(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {activeIncidentDetails.description}
          </p>

          <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Location:</span>
              <span className="text-slate-200 font-medium">{activeIncidentDetails.locationName}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-teal-400 font-semibold">{activeIncidentDetails.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Priority:</span>
              <span className="text-red-400 font-semibold">{activeIncidentDetails.priority}</span>
            </div>
            <div className="flex justify-between">
              <span>Reporter:</span>
              <span className="text-slate-200">{activeIncidentDetails.reporter.name}</span>
            </div>
            {activeIncidentDetails.assignedTeamName && (
              <div className="flex justify-between">
                <span>Assigned Squad:</span>
                <span className="text-amber-400 font-medium">{activeIncidentDetails.assignedTeamName}</span>
              </div>
            )}
          </div>

          {activeIncidentDetails.status === 'PENDING_VERIFICATION' && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  verifyIncident(activeIncidentDetails.id, 'CRITICAL');
                  setActiveIncidentDetails(null);
                }}
                className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-md text-xs font-semibold transition-colors"
              >
                Verify & Escalate Emergency
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
