export interface FlightData {
  flightNo: string;
  airlineName: string;
  airlineIata: string;
  flightStatus: 'scheduled' | 'active' | 'landed' | 'cancelled' | 'incident' | 'diverted';
  origin: {
    airport: string;
    iata: string;
    icao?: string;
    timezone: string;
    scheduled: string;
    estimated?: string;
    actual?: string;
    terminal?: string;
    gate?: string;
    delay?: number;
    temp?: number;
    weather?: string;
    aqi?: number;
  };
  destination: {
    airport: string;
    iata: string;
    icao?: string;
    timezone: string;
    scheduled: string;
    estimated?: string;
    actual?: string;
    terminal?: string;
    gate?: string;
    delay?: number;
    temp?: number;
    weather?: string;
    aqi?: number;
  };
  aircraft?: {
    model: string;
    registration: string;
  };
  isRealTime: boolean;
}

export interface AdvancedAlgorithmResults {
  metarRisk: number;
  metarDesc: string;
  airspaceMinutes: number;
  airspaceDesc: string;
  cascadingRisk: number;
  cascadingDesc: string;
}

export type AppTheme = 'midnight' | 'space' | 'ocean' | 'neon' | 'sunset';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  bgClass: string;
  cardClass: string;
  borderClass: string;
  accentClass: string;
  gradientFrom: string;
  gradientTo: string;
  layout: 'corporate' | 'cyberpunk' | 'minimalist' | 'futuristic' | 'dashboard';
  fontFamily: string;
}

export interface PredictionDetail {
  overallRisk: number;
  factors: {
    weather: number;
    airTraffic: number;
    history: number;
    timeOfDay: number;
  };
  details: {
    weatherDesc: string;
    airTrafficDesc: string;
    historyDesc: string;
    timeDesc: string;
  };
  commentary: string;
  advanced?: AdvancedAlgorithmResults;
}

export interface FavoriteFlight {
  flightNo: string;
  origin: string;
  destination: string;
  airlineName: string;
}

export interface UserSession {
  email: string;
  isLoggedIn: boolean;
  fullName: string;
  isAdmin?: boolean;
}

export interface LoginLogEntry {
  email: string;
  fullName: string;
  action: 'login' | 'logout';
  timestamp: string;
}
