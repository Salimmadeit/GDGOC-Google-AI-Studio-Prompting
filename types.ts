export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  NEON = 'neon',
}

export interface PasswordOptions {
  length: number;
  includeUpper: boolean;
  includeLower: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export interface PasswordHistoryItem {
  password: string;
  timestamp: number;
}
