export interface WorkspaceTheme {
  timezone: string;
  currency: string;
  language: string;
  dateFormat: string;
  timeFormat: string;
}

export interface WorkspaceBranding {
  logo?: string;
  favicon?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface WorkspaceStorage {
  bucket?: string;
  region?: string;
}

export interface WorkspaceNotification {
  email: boolean;
  sms: boolean;
}

export interface WorkspaceFeatures {
  editorEnabled: boolean;
  shopifyEnabled: boolean;
  wordpressEnabled: boolean;
  apiEnabled: boolean;
}

export interface WorkspaceSettings {
  theme: WorkspaceTheme;
  branding: WorkspaceBranding;
  storage: WorkspaceStorage;
  notifications: WorkspaceNotification;
  features: WorkspaceFeatures;
}

export interface WorkspacePreferences {
  [key: string]: any;
}
