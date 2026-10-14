export interface Location {
  id: string;
  name: string;
  shortCode: string;
  category: 'Departments' | 'Laboratories' | 'Library' | 'Administrative' | 'Student Facilities' | 'Food/Canteen' | 'Sports' | 'Hostel' | 'Parking' | 'Other';
  description: string;
  building: string;
  floor: string;
  latitude: number;
  longitude: number;
  x: number; // SVG Schematic X coordinate (0-1000)
  y: number; // SVG Schematic Y coordinate (0-650)
  nearbyLocations: string[];
  aliases: string[];
  isSampleData: boolean;
  image?: string;
  timings?: string;
}

export interface Connection {
  id: string;
  fromLocation: string;
  toLocation: string;
  distance: number; // In meters
  estimatedTime: number; // In minutes walking
  pathDescription: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'visitor';
  department?: string;
  studentId?: string;
}

export interface SearchHistoryItem {
  id: string;
  timestamp: string;
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  distance: number;
}

export interface RouteResult {
  from: Location;
  to: Location;
  path: Location[];
  totalDistance: number; // meters
  estimatedTime: number; // minutes
  steps: string[];
  algorithm?: 'BFS' | 'DFS';
}

export interface FlowTrace {
  intent: 'directions' | 'timing' | 'general';
  algorithm?: 'BFS' | 'DFS';
  detectedDestination?: string;
  detectedStart?: string;
  stage: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  route?: RouteResult;
  targetLocation?: Location;
  quickReplies?: string[];
  isError?: boolean;
  flowTrace?: FlowTrace;
}
