export interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
}

export function ok<T>(data: T): ApiEnvelope<T> {
  return { success: true, data };
}

export function fail(message: string, code?: string, details?: Record<string, unknown>): ApiEnvelope<never> {
  return {
    success: false,
    error: {
      message,
      code,
      details
    }
  };
}
