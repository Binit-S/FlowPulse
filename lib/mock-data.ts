import { Event, Ticket, FoodStall } from "../types";

export const MOCK_EVENT: Event = {
  id: "ipl-mi-csk-2025-04-19",
  name: "MI vs CSK — IPL 2025",
  venue: "Wankhede Stadium",
  venueId: "wankhede",
  datetime: "2025-04-19T19:30:00+05:30",
  status: "live",
  currentPhase: "Over 14",
  timelinePhases: [
    { id: "gates", label: "Gates open", status: "done" },
    { id: "toss", label: "Toss", status: "done" },
    { id: "inn1", label: "Inn. 1 start", status: "done" },
    { id: "over14", label: "Over 14", status: "active" },
    { id: "halftime", label: "Half-time", status: "future" },
    { id: "inn2", label: "Inn. 2", status: "future" },
    { id: "result", label: "Result", status: "future" },
  ]
};

export const MOCK_TICKET: Ticket = {
  id: "BMS-7842901",
  eventId: "ipl-mi-csk-2025-04-19",
  stand: "S3",
  row: "J",
  seat: 22,
  suggestedGate: "C"
};

export const MOCK_STALLS: FoodStall[] = [
  { id: "s1", name: "Dabeli House", emoji: "🌮", standZone: "S3", stallNumber: 3, waitMinutes: 8, queueLength: 6, menuItems: [{ id: "m1", name: "Dabeli", price: 80, available: true }] },
  { id: "s2", name: "CoolSip", emoji: "🥤", standZone: "S2", stallNumber: 7, waitMinutes: 14, queueLength: 11, menuItems: [{ id: "m2", name: "Cold Coffee", price: 120, available: true }] },
  { id: "s3", name: "Burger Pit", emoji: "🍔", standZone: "S1", stallNumber: 1, waitMinutes: 22, queueLength: 19, menuItems: [{ id: "m3", name: "Veg Burger", price: 150, available: true }] },
  { id: "s4", name: "Chai Corner", emoji: "☕", standZone: "S3", stallNumber: 9, waitMinutes: 5, queueLength: 3, menuItems: [{ id: "m4", name: "Masala Chai", price: 50, available: true }] },
];
