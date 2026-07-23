import { SdkConfig } from './types';

// Placeholder for SDK Interfaces
export interface PatternsClient {
  config: SdkConfig;
  init(): Promise<void>;
}
