export type DensityLevel = 'low' | 'medium' | 'high';

export interface Zone {
  id: string;           // e.g. "S1", "S2", "gate-A"
  label: string;
  type: 'stand' | 'gate' | 'toilet' | 'stall' | 'field' | 'screen';
  density: DensityLevel;
  userCount: number;    // from Firebase realtime
  svgPath?: string;     // SVG path or ellipse params for this zone
}

export interface Ticket {
  id: string;
  eventId: string;
  stand: string;        // "S3"
  row: string;          // "J"
  seat: number;         // 22
  suggestedGate: string; // "C"
  userSelectedGate?: string;
}

export interface Event {
  id: string;
  name: string;         // "MI vs CSK — IPL 2025"
  venue: string;        // "Wankhede Stadium"
  venueId: string;      // "wankhede"
  datetime: string;     // ISO string
  status: 'upcoming' | 'live' | 'ended';
  currentPhase?: string; // "Over 14" | "Half-time"
  timelinePhases: TimelinePhase[];
}

export interface TimelinePhase {
  id: string;
  label: string;        // "Gates open", "Toss", "Over 14"
  status: 'done' | 'active' | 'future';
  timestamp?: string;
}

export interface FoodStall {
  id: string;
  name: string;
  emoji: string;        // "🍔"
  standZone: string;    // "S3"
  stallNumber: number;
  waitMinutes: number;  // from Gemini prediction
  queueLength: number;
  menuItems: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export interface RouteStep {
  icon: string;
  label: string;
  sublabel?: string;
}

export interface RouteOption {
  gate: string;         // "A" | "B" | "C" | "D"
  walkMinutes: number;
  crowdLevel: DensityLevel;
  steps: RouteStep[];
  isSuggested: boolean;
}

export interface GateReport {
  gate: string;
  userId: string;       // anonymous session ID
  density: DensityLevel;
  timestamp: number;
}
