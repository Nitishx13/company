import { laravelService } from './api';
import { mockService } from './mock';
import { isLaravelBackend, laravelBaseUrl, type GmbqynService } from './service';

let instance: GmbqynService | null = null;

/**
 * Resolves the active backend for the GMBQYN module.
 *
 * Set `NEXT_PUBLIC_GMBQYN_API_URL` (or `GMBQYN_API_URL`) to your Laravel
 * origin and every screen talks to it. Leave it unset and the module runs
 * against the local mock adapter so the product stays fully usable.
 */
export function getGmbqynService(): GmbqynService {
  if (!instance) {
    instance = isLaravelBackend() ? laravelService : mockService;
  }
  return instance;
}

export const isDemoMode = () => !isLaravelBackend();

export { laravelBaseUrl, isLaravelBackend };
export type { GmbqynService, AdminAnalytics, BusinessPayload, PaymentPayload, PublicBusiness, SubscriptionPayload } from './service';
export * from './types';
export * from './plans';
export * from './format';
export * from './qr';
export { GmbqynApiError } from './api';
