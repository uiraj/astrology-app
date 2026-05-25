export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type BirthDataParams = {
  birthDate: string;    // ISO date string, e.g. "1990-01-15T00:00:00.000Z"
  birthTime?: string;   // "HH:MM" 24-hour, e.g. "14:30"
  location?: string;    // "City, Country"
  lat?: number;
  lon?: number;
};

export type MainStackParamList = {
  Tabs: undefined;
  BirthData: { isEdit?: boolean } | undefined;
  HoroscopeResult: BirthDataParams;
};
