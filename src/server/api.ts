import { randomUUID } from 'node:crypto';

export interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
  requestId?: string;
  appUrl?: string;
}

export function ok<T>(data: T, requestId?: string): ApiEnvelope<T> {
  return {
    success: true,
    data,
    requestId: requestId || randomUUID().slice(0, 8),
    appUrl: process.env.NEXT_PUBLIC_APP_URL || undefined,
  };
}

export function fail(message: string, code?: string, details?: Record<string, unknown>, requestId?: string): ApiEnvelope<never> {
  return {
    success: false,
    error: {
      message,
      code,
      details
    },
    requestId: requestId || randomUUID().slice(0, 8),
    appUrl: process.env.NEXT_PUBLIC_APP_URL || undefined,
  };
}

export function getRequestId(request: Request): string {
  return request.headers.get('x-request-id') || randomUUID().slice(0, 8);
}
