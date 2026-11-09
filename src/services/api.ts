/**
 * Godavari Raksha - Client API Service
 * PS-02: Emergency Detection, Public Safety and Response Coordination
 */

import { Incident, ResponseTeam, AiCctvAlert, MissingPersonReport, PublicAnnouncement, FamilySafetyGroup } from '../types';

export const apiClient = {
  async fetchSnapshot() {
    try {
      const res = await fetch('/api/database/snapshot');
      if (!res.ok) throw new Error(`Snapshot failed: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend snapshot fetch failed, falling back to local storage / memory:', err);
      return null;
    }
  },

  async resetDatabase() {
    const res = await fetch('/api/database/reset', { method: 'POST' });
    return await res.json();
  },

  async createIncident(incidentData: Partial<Incident>): Promise<Incident> {
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incidentData),
      });
      if (!res.ok) throw new Error('Failed to create incident on server');
      return await res.json();
    } catch (err) {
      // Local offline fallback
      console.warn('Network offline, returning locally generated incident', err);
      const fallback: Incident = {
        id: `INC-OFFLINE-${Date.now().toString().slice(-4)}`,
        category: incidentData.category || 'medical',
        priority: incidentData.priority || 'HIGH',
        status: 'NEW',
        title: incidentData.title || 'Offline Emergency Report',
        description: incidentData.description || 'Reported via client',
        locationName: incidentData.locationName || 'Pushkar Ghat',
        coordinates: incidentData.coordinates || { lat: 16.9935, lng: 81.7725 },
        reporter: incidentData.reporter || { name: 'Local User', phone: '+91 90000 00000' },
        timestamp: new Date().toISOString(),
        isSyntheticDemo: true,
        auditTrail: [
          {
            timestamp: new Date().toISOString(),
            action: 'OFFLINE_SOS_CREATED',
            actor: 'Client App',
            actorRole: 'pilgrim',
          },
        ],
      };
      return fallback;
    }
  },

  async updateIncident(id: string, updates: Partial<Incident> & { auditEntry?: any }): Promise<Incident> {
    const res = await fetch(`/api/incidents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update incident');
    return await res.json();
  },

  async getDispatchRecommendation(incidentId: string, category?: string, coordinates?: { lat: number; lng: number }) {
    const res = await fetch('/api/dispatch/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incidentId, category, coordinates }),
    });
    if (!res.ok) throw new Error('Failed to get recommendation');
    return await res.json();
  },

  async analyzeCctvFrame(imageBase64: string, cameraLocation?: string, cameraId?: string) {
    const res = await fetch('/api/gemini/cctv-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, cameraLocation, cameraId }),
    });
    if (!res.ok) throw new Error('CCTV analysis failed');
    return await res.json();
  },

  async sendAiChat(message: string, language: string, role: string, contextData?: any) {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language, role, contextData }),
    });
    if (!res.ok) throw new Error('AI Chat request failed');
    return await res.json();
  },

  async reportMissingPerson(data: Partial<MissingPersonReport>): Promise<MissingPersonReport> {
    const res = await fetch('/api/missing-persons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async updateMissingPerson(id: string, updates: Partial<MissingPersonReport>) {
    const res = await fetch(`/api/missing-persons/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return await res.json();
  },

  async createAnnouncement(data: Partial<PublicAnnouncement>): Promise<PublicAnnouncement> {
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async createFamilyGroup(groupData: any): Promise<FamilySafetyGroup> {
    const res = await fetch('/api/family-groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(groupData),
    });
    return await res.json();
  },

  async updateRiverTelemetry(sensorId: string, waterLevelMeters: number, flowVelocityMps?: number) {
    const res = await fetch('/api/river/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sensorId, waterLevelMeters, flowVelocityMps }),
    });
    return await res.json();
  },

  async searchGoogleMaps(query: string, latitude?: number, longitude?: number) {
    const res = await fetch('/api/maps/grounding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, latitude, longitude }),
    });
    if (!res.ok) throw new Error('Google Maps search failed');
    return await res.json();
  },
};
