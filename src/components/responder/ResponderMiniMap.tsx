/**
 * Godavari Raksha - Responder Mini Leaflet Map
 * Displays real-time tactical positioning of the Responder relative to the Dispatch target
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Navigation, Compass, ExternalLink } from 'lucide-react';

interface ResponderMiniMapProps {
  responderCoords: [number, number];
  dispatchCoords: [number, number];
  responderName: string;
  dispatchLocationName: string;
  incidentTitle: string;
}

export const ResponderMiniMap: React.FC<ResponderMiniMapProps> = ({
  responderCoords,
  dispatchCoords,
  responderName,
  dispatchLocationName,
  incidentTitle,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [distanceMeters, setDistanceMeters] = useState<number>(0);
  const [etaMinutes, setEtaMinutes] = useState<number>(1);

  // Haversine distance
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371000; // meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const dist = calculateDistance(
      responderCoords[0],
      responderCoords[1],
      dispatchCoords[0],
      dispatchCoords[1]
    );
    setDistanceMeters(dist);
    // Average emergency response speed through ghat cordons: ~12-15 km/h
    const eta = Math.max(1, Math.round(dist / 250));
    setEtaMinutes(eta);

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: [
        (responderCoords[0] + dispatchCoords[0]) / 2,
        (responderCoords[1] + dispatchCoords[1]) / 2,
      ],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: false,
    });

    // Dark / crisp tile layer
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        subdomains: 'abcd',
      }
    ).addTo(map);

    // 1. Responder Pin (Blue/Teal Pulse)
    const responderIcon = L.divIcon({
      className: 'custom-responder-marker',
      html: `
        <div style="position: relative; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 26px; height: 26px; border-radius: 50%; background: rgba(20, 184, 166, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 18px; height: 18px; border-radius: 50%; background: #0d9488; border: 2.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">
            👮
          </div>
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });

    const responderMarker = L.marker(responderCoords, { icon: responderIcon }).addTo(map);
    responderMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 11px;">
        <b style="color: #0f766e;">You (Responder)</b><br/>
        <span>${responderName}</span>
      </div>
    `);

    // 2. Dispatch Incident Pin (Red Alert Pulse)
    const dispatchIcon = L.divIcon({
      className: 'custom-dispatch-marker',
      html: `
        <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(239, 68, 68, 0.4); animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 20px; height: 20px; border-radius: 50%; background: #dc2626; border: 2.5px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: 800;">
            !
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const dispatchMarker = L.marker(dispatchCoords, { icon: dispatchIcon }).addTo(map);
    dispatchMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 11px;">
        <b style="color: #b91c1c;">Dispatch Destination</b><br/>
        <span>${dispatchLocationName}</span><br/>
        <i style="color: #64748b;">${incidentTitle}</i>
      </div>
    `);

    // 3. Tactical Dispatch Path Polyline (Dashed Teal Line)
    const polyline = L.polyline([responderCoords, dispatchCoords], {
      color: '#0d9488',
      weight: 3.5,
      opacity: 0.85,
      dashArray: '6, 8',
    }).addTo(map);

    // Fit bounds to show both locations with padding
    const bounds = L.latLngBounds([responderCoords, dispatchCoords]);
    map.fitBounds(bounds, { padding: [35, 35], maxZoom: 16 });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [responderCoords, dispatchCoords, responderName, dispatchLocationName, incidentTitle]);

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${responderCoords[0]},${responderCoords[1]}&destination=${dispatchCoords[0]},${dispatchCoords[1]}&travelmode=walking`;

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-md">
      {/* Top Tactical Status Overlay */}
      <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-2.5 py-1 rounded-md text-[10px] font-mono text-slate-200 flex items-center gap-1.5 shadow pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Tactical Radar</span>
          <span className="text-teal-400 font-bold ml-1">
            {distanceMeters > 1000 ? `${(distanceMeters / 1000).toFixed(1)} km` : `${distanceMeters} m`}
          </span>
          <span className="text-slate-400">· ETA ~{etaMinutes}m</span>
        </div>

        <a
          href={googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-teal-600/90 hover:bg-teal-500 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow pointer-events-auto transition-colors"
          title="Open Turn-by-Turn GPS Directions"
        >
          <Navigation className="w-3 h-3" />
          <span>GPS ↗</span>
        </a>
      </div>

      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-44 z-0" />

      {/* Bottom Legend Overlay */}
      <div className="bg-slate-950/90 border-t border-slate-800 px-3 py-1.5 flex items-center justify-between text-[10px] text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          <span className="text-slate-300">You (Patrol Post)</span>
        </div>
        <span className="text-slate-500">━━━</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="text-red-400 font-semibold">{dispatchLocationName}</span>
        </div>
      </div>
    </div>
  );
};
