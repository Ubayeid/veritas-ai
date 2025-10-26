/**
 * Initialize AIID data on application startup
 */

import { aiidLoader } from './aiid-loader';

let isInitialized = false;

export async function initializeAIIDData(): Promise<void> {
  if (isInitialized) return;
  
  try {
    console.log('Initializing AIID data...');
    const incidents = await aiidLoader.loadAllData();
    console.log(`AIID initialization complete: ${incidents.length} incidents loaded`);
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize AIID data:', error);
  }
}

export function isAIIDInitialized(): boolean {
  return isInitialized;
}
