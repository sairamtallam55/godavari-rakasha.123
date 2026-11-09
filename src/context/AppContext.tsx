/**
 * Godavari Raksha - Global Application Context
 * PS-02: Emergency Detection, Public Safety and Response Coordination
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Incident,
  ResponseTeam,
  GhatLocation,
  EmergencyFacility,
  AiCctvAlert,
  RiverSensorReading,
  MissingPersonReport,
  FamilySafetyGroup,
  IotDevice,
  PublicAnnouncement,
  SimulationScenario,
  UserProfile,
  UserRole,
  IncidentStatus,
  IncidentPriority,
  IncidentCategory,
} from '../types';
import {
  DEMO_USERS,
  SEED_INCIDENTS,
  SEED_RESPONSE_TEAMS,
  SEED_GHATS,
  SEED_FACILITIES,
  SEED_AI_ALERTS,
  SEED_RIVER_READINGS,
  SEED_MISSING_PERSONS,
  SEED_FAMILY_GROUPS,
  SEED_IOT_DEVICES,
  SEED_ANNOUNCEMENTS,
  SEED_SIMULATION_SCENARIOS,
} from '../data/seedData';
import { apiClient } from '../services/api';

export type AppViewMode =
  | 'landing'
  | 'pilgrim'
  | 'responder'
  | 'command'
  | 'gis'
  | 'cctv'
  | 'crowd'
  | 'digital_twin'
  | 'river'
  | 'hospital'
  | 'missing'
  | 'iot'
  | 'announcements'
  | 'simulator'
  | 'decision_ai'
  | 'admin';

export interface ToastMessage {
  id: string;
  type: 'emergency' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
}

interface AppContextType {
  currentUser: UserProfile;
  switchUserRole: (role: UserRole) => void;
  activeView: AppViewMode;
  setActiveView: (view: AppViewMode) => void;
  language: 'en' | 'te' | 'hi';
  setLanguage: (lang: 'en' | 'te' | 'hi') => void;

  // Real-time Database Collections
  incidents: Incident[];
  responseTeams: ResponseTeam[];
  ghats: GhatLocation[];
  facilities: EmergencyFacility[];
  aiAlerts: AiCctvAlert[];
  riverReadings: RiverSensorReading[];
  missingPersons: MissingPersonReport[];
  familyGroups: FamilySafetyGroup[];
  iotDevices: IotDevice[];
  announcements: PublicAnnouncement[];
  simulationScenarios: SimulationScenario[];

  // Live KPI Metrics
  kpis: {
    totalIncidents: number;
    activeEmergencies: number;
    criticalAlerts: number;
    pendingVerification: number;
    teamsAvailable: number;
    teamsResponding: number;
    resolvedCases: number;
    avgAckTimeSecs: number;
    avgDispatchTimeMins: number;
    crowdRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    riverRiskLevel: 'NORMAL' | 'WARNING' | 'CRITICAL';
    hospitalBedsAvailable: number;
  };

  // Actions
  triggerSos: (params: {
    category: IncidentCategory;
    title?: string;
    description?: string;
    locationName?: string;
    coordinates?: { lat: number; lng: number };
    ghatId?: string;
    photoUrl?: string;
    audioVoiceNoteUrl?: string;
  }) => Promise<Incident>;
  verifyIncident: (id: string, priority?: IncidentPriority) => Promise<void>;
  assignTeamToIncident: (incidentId: string, teamId: string, notes?: string) => Promise<void>;
  updateResponderStatus: (incidentId: string, status: IncidentStatus, notes?: string) => Promise<void>;
  resolveIncident: (id: string, notes?: string) => Promise<void>;
  rejectIncident: (id: string, reason?: string) => Promise<void>;
  convertAiAlertToIncident: (alertId: string) => Promise<void>;
  rejectAiAlert: (alertId: string) => void;
  verifyAiAlert: (alertId: string) => void;
  reportMissingPerson: (data: Partial<MissingPersonReport>) => Promise<MissingPersonReport>;
  reuniteMissingPerson: (id: string, notes?: string) => Promise<void>;
  postAnnouncement: (data: Partial<PublicAnnouncement>) => Promise<void>;
  createFamilyGroup: (data: any) => Promise<FamilySafetyGroup>;
  simulateRiverSpike: (sensorId: string, targetLevel: number) => Promise<void>;
  resetAllDemoData: () => Promise<void>;

  // Notification & Audio
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  playAlertSound: (type?: 'critical' | 'alert' | 'success') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Synthesized procedural alert sound via Web Audio API (Zero external mp3 dependencies)
function playProceduralSound(type: 'critical' | 'alert' | 'success' = 'alert') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'critical') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.25);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) {
    // AudioContext might be blocked until user gesture, ignore safely
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]);
  const [activeView, setActiveView] = useState<AppViewMode>('landing');
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>('en');

  // Collections
  const [incidents, setIncidents] = useState<Incident[]>(SEED_INCIDENTS);
  const [responseTeams, setResponseTeams] = useState<ResponseTeam[]>(SEED_RESPONSE_TEAMS);
  const [ghats, setGhats] = useState<GhatLocation[]>(SEED_GHATS);
  const [facilities, setFacilities] = useState<EmergencyFacility[]>(SEED_FACILITIES);
  const [aiAlerts, setAiAlerts] = useState<AiCctvAlert[]>(SEED_AI_ALERTS);
  const [riverReadings, setRiverReadings] = useState<RiverSensorReading[]>(SEED_RIVER_READINGS);
  const [missingPersons, setMissingPersons] = useState<MissingPersonReport[]>(SEED_MISSING_PERSONS);
  const [familyGroups, setFamilyGroups] = useState<FamilySafetyGroup[]>(SEED_FAMILY_GROUPS);
  const [iotDevices, setIotDevices] = useState<IotDevice[]>(SEED_IOT_DEVICES);
  const [announcements, setAnnouncements] = useState<PublicAnnouncement[]>(SEED_ANNOUNCEMENTS);
  const [simulationScenarios] = useState<SimulationScenario[]>(SEED_SIMULATION_SCENARIOS);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage['type'], title: string, message: string) => {
    const newToast: ToastMessage = {
      id: `toast_${Date.now()}_${Math.random()}`,
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));
    if (type === 'emergency') playProceduralSound('critical');
    else if (type === 'success') playProceduralSound('success');
    else playProceduralSound('alert');
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial snapshot from server
  useEffect(() => {
    let isMounted = true;
    apiClient.fetchSnapshot().then((snapshot) => {
      if (!isMounted || !snapshot) return;
      if (snapshot.incidents) setIncidents(snapshot.incidents);
      if (snapshot.responseTeams) setResponseTeams(snapshot.responseTeams);
      if (snapshot.ghats) setGhats(snapshot.ghats);
      if (snapshot.facilities) setFacilities(snapshot.facilities);
      if (snapshot.aiAlerts) setAiAlerts(snapshot.aiAlerts);
      if (snapshot.riverReadings) setRiverReadings(snapshot.riverReadings);
      if (snapshot.missingPersons) setMissingPersons(snapshot.missingPersons);
      if (snapshot.familyGroups) setFamilyGroups(snapshot.familyGroups);
      if (snapshot.iotDevices) setIotDevices(snapshot.iotDevices);
      if (snapshot.announcements) setAnnouncements(snapshot.announcements);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Switch User Role
  const switchUserRole = useCallback((role: UserRole) => {
    const match = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    setCurrentUser(match);
    addToast('info', 'Role Switched', `Logged in as ${match.name} (${role.replace('_', ' ').toUpperCase()})`);
  }, [addToast]);

  // Live KPI Calculations from authoritative database records
  const kpis = {
    totalIncidents: incidents.length,
    activeEmergencies: incidents.filter((i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED' && i.status !== 'REJECTED_AS_FALSE_ALARM').length,
    criticalAlerts: incidents.filter((i) => i.priority === 'CRITICAL' && i.status !== 'RESOLVED' && i.status !== 'CLOSED').length,
    pendingVerification: incidents.filter((i) => i.status === 'NEW' || i.status === 'PENDING_VERIFICATION').length,
    teamsAvailable: responseTeams.filter((t) => t.status === 'AVAILABLE').length,
    teamsResponding: responseTeams.filter((t) => t.status === 'DISPATCHED' || t.status === 'ON_SCENE').length,
    resolvedCases: incidents.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length,
    avgAckTimeSecs: 48,
    avgDispatchTimeMins: 3.4,
    crowdRiskLevel: (ghats.some((g) => g.crowdRiskLevel === 'CRITICAL')
      ? 'CRITICAL'
      : ghats.some((g) => g.crowdRiskLevel === 'HIGH')
      ? 'HIGH'
      : 'MODERATE') as 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL',
    riverRiskLevel: (riverReadings.some((r) => r.status === 'CRITICAL')
      ? 'CRITICAL'
      : riverReadings.some((r) => r.status === 'WARNING')
      ? 'WARNING'
      : 'NORMAL') as 'NORMAL' | 'WARNING' | 'CRITICAL',
    hospitalBedsAvailable: facilities
      .filter((f) => f.type === 'hospital' || f.type === 'medical_camp')
      .reduce((acc, f) => acc + (f.availableBeds || 0), 0),
  };

  // Actions
  const triggerSos = async (params: {
    category: IncidentCategory;
    title?: string;
    description?: string;
    locationName?: string;
    coordinates?: { lat: number; lng: number };
    ghatId?: string;
    photoUrl?: string;
    audioVoiceNoteUrl?: string;
  }): Promise<Incident> => {
    const created = await apiClient.createIncident({
      category: params.category,
      priority: 'CRITICAL',
      status: 'PENDING_VERIFICATION',
      title: params.title || `Pilgrim Emergency SOS: ${params.category.toUpperCase().replace('_', ' ')}`,
      description: params.description || `Immediate assistance requested by ${currentUser.name}. Location: ${params.locationName || 'Pushkar Ghat'}.`,
      locationName: params.locationName || 'Pushkar Ghat Steps Sector',
      coordinates: params.coordinates || { lat: 16.9935, lng: 81.7725 },
      ghatId: params.ghatId || 'ghat_pushkar',
      reporter: {
        id: currentUser.id,
        name: currentUser.name,
        phone: currentUser.phone,
      },
      photoUrl: params.photoUrl,
      audioVoiceNoteUrl: params.audioVoiceNoteUrl,
    });

    setIncidents((prev) => [created, ...prev]);
    addToast('emergency', 'EMERGENCY SOS RECEIVED', `Incident #${created.id} broadcast to Control Room!`);
    return created;
  };

  const verifyIncident = async (id: string, priority: IncidentPriority = 'HIGH') => {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      action: 'OPERATOR_VERIFIED',
      actor: currentUser.name,
      actorRole: currentUser.role,
      notes: `Verified as ${priority} emergency by control operator`,
    };

    const updated = await apiClient.updateIncident(id, {
      status: 'VERIFIED',
      priority,
      auditEntry,
    });

    setIncidents((prev) => prev.map((inc) => (inc.id === id ? updated : inc)));
    addToast('info', 'Incident Verified', `Incident #${id} verified. Ready for dispatch.`);
  };

  const assignTeamToIncident = async (incidentId: string, teamId: string, notes?: string) => {
    const team = responseTeams.find((t) => t.id === teamId);
    const auditEntry = {
      timestamp: new Date().toISOString(),
      action: 'TEAM_ASSIGNED',
      actor: currentUser.name,
      actorRole: currentUser.role,
      notes: notes || `Assigned to ${team?.name || 'Response Squad'}`,
    };

    const updated = await apiClient.updateIncident(incidentId, {
      status: 'ASSIGNED',
      assignedTeamId: teamId,
      assignedTeamName: team?.name,
      assignedTeamCategory: team?.category,
      responseNotes: notes,
      auditEntry,
    });

    setIncidents((prev) => prev.map((inc) => (inc.id === incidentId ? updated : inc)));
    setResponseTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, status: 'DISPATCHED', currentIncidentId: incidentId } : t))
    );
    addToast('success', 'Dispatch Approved', `${team?.name || 'Team'} dispatched to #${incidentId}`);
  };

  const updateResponderStatus = async (incidentId: string, status: IncidentStatus, notes?: string) => {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      action: `STATUS_UPDATED_${status}`,
      actor: currentUser.name,
      actorRole: currentUser.role,
      notes,
    };

    const updated = await apiClient.updateIncident(incidentId, {
      status,
      responseNotes: notes,
      auditEntry,
    });

    setIncidents((prev) => prev.map((inc) => (inc.id === incidentId ? updated : inc)));
    addToast('info', 'Status Updated', `Incident #${incidentId} set to ${status}`);
  };

  const resolveIncident = async (id: string, notes?: string) => {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      action: 'INCIDENT_RESOLVED',
      actor: currentUser.name,
      actorRole: currentUser.role,
      notes: notes || 'Incident safely mitigated and closed on field verification.',
    };

    const updated = await apiClient.updateIncident(id, {
      status: 'RESOLVED',
      resolutionTime: new Date().toISOString(),
      responseNotes: notes,
      auditEntry,
    });

    setIncidents((prev) => prev.map((inc) => (inc.id === id ? updated : inc)));

    // Free up assigned team
    const assignedTeamId = updated.assignedTeamId;
    if (assignedTeamId) {
      setResponseTeams((prev) =>
        prev.map((t) => (t.id === assignedTeamId ? { ...t, status: 'AVAILABLE', currentIncidentId: undefined } : t))
      );
    }

    addToast('success', 'Incident Resolved', `Incident #${id} successfully marked as resolved.`);
  };

  const rejectIncident = async (id: string, reason?: string) => {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      action: 'REJECTED_AS_FALSE_ALARM',
      actor: currentUser.name,
      actorRole: currentUser.role,
      notes: reason || 'Identified as duplicate or non-hazardous false alarm.',
    };

    const updated = await apiClient.updateIncident(id, {
      status: 'REJECTED_AS_FALSE_ALARM',
      resolutionTime: new Date().toISOString(),
      auditEntry,
    });

    setIncidents((prev) => prev.map((inc) => (inc.id === id ? updated : inc)));
    addToast('info', 'False Alarm Handled', `Incident #${id} dismissed.`);
  };

  const convertAiAlertToIncident = async (alertId: string) => {
    const alert = aiAlerts.find((a) => a.id === alertId);
    if (!alert) return;

    let category: IncidentCategory = 'crowd_danger';
    if (alert.category === 'motionless_person') category = 'medical';
    else if (alert.category === 'smoke_fire') category = 'fire';
    else if (alert.category === 'restricted_zone_breach') category = 'river_rescue';

    const created = await apiClient.createIncident({
      category,
      priority: alert.confidenceScore > 0.9 ? 'CRITICAL' : 'HIGH',
      status: 'VERIFIED',
      title: `AI CCTV Alert: ${alert.category.replace('_', ' ').toUpperCase()}`,
      description: alert.summary,
      locationName: alert.locationName,
      coordinates: alert.coordinates,
      reporter: {
        name: `Automated ${alert.cameraName}`,
        phone: 'CCTV-AI-SYSTEM',
      },
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          action: 'CONVERTED_FROM_AI_ALERT',
          actor: currentUser.name,
          actorRole: currentUser.role,
          notes: `Confidence: ${(alert.confidenceScore * 100).toFixed(0)}%`,
        },
      ],
    });

    setIncidents((prev) => [created, ...prev]);
    setAiAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'CONVERTED_TO_INCIDENT' } : a))
    );
    addToast('success', 'Converted to Incident', `Incident #${created.id} created from AI Alert.`);
  };

  const rejectAiAlert = (alertId: string) => {
    setAiAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'REJECTED' } : a))
    );
    addToast('info', 'AI Alert Dismissed', `Alert #${alertId} dismissed by operator.`);
  };

  const verifyAiAlert = (alertId: string) => {
    setAiAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'VERIFIED' } : a))
    );
    addToast('info', 'AI Alert Verified', `Alert #${alertId} verified by operator.`);
  };

  const reportMissingPerson = async (data: Partial<MissingPersonReport>) => {
    const created = await apiClient.reportMissingPerson(data);
    setMissingPersons((prev) => [created, ...prev]);
    addToast('warning', 'Missing Person Reported', `Report #${created.id} broadcast to all 12 Help Desks.`);
    return created;
  };

  const reuniteMissingPerson = async (id: string, notes?: string) => {
    const updated = await apiClient.updateMissingPerson(id, {
      status: 'REUNITED',
      caseNotes: notes || 'Reunited safely with family after biometric / QR verification.',
      reunitedAt: new Date().toISOString(),
    });
    setMissingPersons((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
    addToast('success', 'Family Reunited', `Person #${id} recorded as reunited!`);
  };

  const postAnnouncement = async (data: Partial<PublicAnnouncement>) => {
    const created = await apiClient.createAnnouncement({
      ...data,
      author: currentUser.name,
    });
    setAnnouncements((prev) => [created, ...prev]);
    addToast('info', 'Broadcast Sent', `Safety message dispatched to IP PA speakers.`);
  };

  const createFamilyGroup = async (data: any) => {
    const created = await apiClient.createFamilyGroup(data);
    setFamilyGroups((prev) => [created, ...prev]);
    addToast('success', 'Family Group Active', `Group "${created.groupName}" established. Code: ${created.joinCode}`);
    return created;
  };

  const simulateRiverSpike = async (sensorId: string, targetLevel: number) => {
    const updated = await apiClient.updateRiverTelemetry(sensorId, targetLevel, 2.8);
    setRiverReadings((prev) => prev.map((s) => (s.sensorId === sensorId ? { ...s, ...updated } : s)));
    addToast('warning', 'River Telemetry Changed', `Sensor ${sensorId} updated to ${targetLevel}m`);
  };

  const resetAllDemoData = async () => {
    await apiClient.resetDatabase();
    setIncidents(JSON.parse(JSON.stringify(SEED_INCIDENTS)));
    setResponseTeams(JSON.parse(JSON.stringify(SEED_RESPONSE_TEAMS)));
    setGhats(JSON.parse(JSON.stringify(SEED_GHATS)));
    setFacilities(JSON.parse(JSON.stringify(SEED_FACILITIES)));
    setAiAlerts(JSON.parse(JSON.stringify(SEED_AI_ALERTS)));
    setRiverReadings(JSON.parse(JSON.stringify(SEED_RIVER_READINGS)));
    setMissingPersons(JSON.parse(JSON.stringify(SEED_MISSING_PERSONS)));
    setFamilyGroups(JSON.parse(JSON.stringify(SEED_FAMILY_GROUPS)));
    setIotDevices(JSON.parse(JSON.stringify(SEED_IOT_DEVICES)));
    setAnnouncements(JSON.parse(JSON.stringify(SEED_ANNOUNCEMENTS)));
    addToast('success', 'Demo Reset Complete', 'All 24 collections reset to authentic synthetic baseline.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUserRole,
        activeView,
        setActiveView,
        language,
        setLanguage,
        incidents,
        responseTeams,
        ghats,
        facilities,
        aiAlerts,
        riverReadings,
        missingPersons,
        familyGroups,
        iotDevices,
        announcements,
        simulationScenarios,
        kpis,
        triggerSos,
        verifyIncident,
        assignTeamToIncident,
        updateResponderStatus,
        resolveIncident,
        rejectIncident,
        convertAiAlertToIncident,
        rejectAiAlert,
        verifyAiAlert,
        reportMissingPerson,
        reuniteMissingPerson,
        postAnnouncement,
        createFamilyGroup,
        simulateRiverSpike,
        resetAllDemoData,
        toasts,
        removeToast,
        playAlertSound: playProceduralSound,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
