
export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface RadioConfig {
  streamUrl: string;
  fallbackUrl: string;
  stationName: string;
  isLive: boolean;
}

export interface AdminState {
  isAuthenticated: boolean;
}

export enum View {
  RADIO = 'radio',
  PRAYER = 'prayer',
  ADMIN = 'admin'
}
