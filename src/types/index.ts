/**
 * Godavari Raksha - Core TypeScript Types & Interfaces
 * PS-02: Emergency Detection, Public Safety and Response Coordination
 * Godavari Pushkaralu 2027 (RMC & RTIH)
 */

export type UserRole = 
  | 'super_admin'
  | 'control_operator'
  | 'police_responder'
  | 'medical_responder'
  | 'fire_responder'
  | 'pilgrim';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  agency?: string;
  badgeNumber?: string;
  assignedGhatId?: string;
  isAvailable?: boolean;
  avatarUrl?: string;
}

export type IncidentCategory = 
  | 'medical'
  | 'accident'
  | 'crowd_danger'
  | 'fire'
  | 'river_rescue'
  | 'missing_person'
  | 'other';

export type IncidentPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus = 
  | 'NEW'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'RESPONDING'
  | 'ARRIVED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REJECTED_AS_FALSE_ALARM';

export interface IncidentAuditEntry {
  timestamp: string;
  action: string;
  actor: string;
  actorRole: string;
  notes?: string;
}

export interface Incident {
  id: string;
  category: IncidentCategory;
  priority: IncidentPriority;
  status: IncidentStatus;
  title: string;
  description: string;
  locationName: string;
  ghatId?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  reporter: {
    id?: string;
    name: string;
    phone: string;
    isAnonymous?: boolean;
  };
  timestamp: string;
  assignedTeamId?: string;
  assignedTeamName?: string;
  assignedTeamCategory?: 'ambulance' | 'police' | 'fire_rescue' | 'water_rescue' | 'crowd_patrol';
  responseNotes?: string;
  resolutionTime?: string;
  photoUrl?: string;
  audioVoiceNoteUrl?: string;
  isSyntheticDemo?: boolean;
  auditTrail: IncidentAuditEntry[];
}

export interface ResponseTeam {
  id: string;
  name: string;
  agency: 'Police' | 'Medical' | 'Fire & Rescue' | 'River Rescue' | 'Municipal Corporation';
  category: 'ambulance' | 'police' | 'fire_rescue' | 'water_rescue' | 'crowd_patrol';
  status: 'AVAILABLE' | 'DISPATCHED' | 'ON_SCENE' | 'OFF_DUTY';
  currentLocationName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  leadOfficer: string;
  contactNumber: string;
  capabilities: string[];
  vehicleNumber?: string;
  currentIncidentId?: string;
  assignedCount: number;
}

export interface GhatLocation {
  id: string;
  name: string;
  teluguName: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  capacityPilgrims: number;
  currentCrowdCount: number;
  crowdRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  waterDepthMeters: number;
  riverFlowVelocityMps: number;
  hasMedicalPost: boolean;
  hasPoliceDesk: boolean;
  hasRiverRescueBoat: boolean;
  emergencyExits: string[];
}

export interface EmergencyFacility {
  id: string;
  name: string;
  type: 'hospital' | 'medical_camp' | 'police_station' | 'fire_station' | 'rescue_boat_dock';
  locationName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  contactPhone: string;
  totalBeds?: number;
  availableBeds?: number;
  icuAvailable?: number;
  ambulancesOnSite?: number;
  staffOnDuty: number;
}

export interface AiCctvAlert {
  id: string;
  cameraId: string;
  cameraName: string;
  locationName: string;
  category: 'crowd_congestion' | 'motionless_person' | 'unusual_surge' | 'smoke_fire' | 'restricted_zone_breach';
  confidenceScore: number;
  detectedAt: string;
  status: 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED' | 'CONVERTED_TO_INCIDENT';
  summary: string;
  frameUrl?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface RiverSensorReading {
  id: string;
  sensorId: string;
  locationName: string;
  waterLevelMeters: number;
  safeThresholdMeters: number;
  warningThresholdMeters: number;
  dangerThresholdMeters: number;
  flowVelocityMps: number;
  rainfallMm24h: number;
  waterTemperatureC: number;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  recordedAt: string;
}

export interface MissingPersonReport {
  id: string;
  name: string;
  approxAge: number;
  gender: 'MALE' | 'FEMALE' | 'CHILD' | 'OTHER';
  clothingDescription: string;
  lastSeenLocation: string;
  lastSeenTime: string;
  contactPerson: string;
  contactPhone: string;
  status: 'REPORTED' | 'SEARCH_IN_PROGRESS' | 'SPOTTED' | 'REUNITED' | 'CLOSED';
  caseNotes?: string;
  photoUrl?: string;
  reunitedAt?: string;
}

export interface FamilySafetyGroup {
  id: string;
  groupName: string;
  joinCode: string;
  creatorPhone: string;
  members: {
    id: string;
    name: string;
    phone: string;
    role: 'ADMIN' | 'MEMBER';
    sharingLocation: boolean;
    lastCoordinates?: {
      lat: number;
      lng: number;
    };
    lastUpdated?: string;
    batteryLevel?: number;
  }[];
  meetingPointName: string;
}

export interface IotDevice {
  id: string;
  name: string;
  type: 'water_level_sensor' | 'crowd_counter' | 'panic_button' | 'air_quality' | 'smart_speaker';
  locationName: string;
  status: 'ONLINE' | 'WARNING' | 'OFFLINE';
  batteryPercentage: number;
  lastPing: string;
  telemetryValue: string;
}

export interface PublicAnnouncement {
  id: string;
  title: string;
  messageText: string;
  language: 'all' | 'telugu' | 'hindi' | 'english';
  targetZones: string[];
  priority: 'EMERGENCY' | 'ADVISORY' | 'INFO';
  broadcastedAt: string;
  author: string;
  isActive: boolean;
}

export interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  category: 'ghat_overcrowding' | 'flash_flood_surge' | 'fire_outbreak' | 'bridge_bottleneck' | 'multi_emergency_surge';
  severity: 'HIGH' | 'CRITICAL';
  affectedZones: string[];
  simulatedPilgrimCount: number;
  expectedCasualtyRisk: string;
  requiredTeams: string[];
  recommendedActions: string[];
}
