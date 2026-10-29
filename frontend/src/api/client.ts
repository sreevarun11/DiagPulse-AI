import { HealthResponse, SymptomsResponse, ModelInfoResponse, PredictResponse } from '../types';

const API_BASE = '/api';

export class ApiError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string = 'API_ERROR', details?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      let errBody: any;
      try {
        errBody = await res.json();
      } catch {
        errBody = { error: { message: `HTTP Error ${res.status}: ${res.statusText}` } };
      }

      const errorObj = errBody.error || {};
      let msg = errorObj.message || `Request failed with status ${res.status}`;
      if (res.status === 503) {
        msg = errorObj.message || 'Diagnostic backend is unavailable. Ensure FastAPI is running on http://127.0.0.1:8000.';
      }
      throw new ApiError(
        msg,
        errorObj.code || `HTTP_${res.status}`,
        errorObj.details
      );
    }

    return await res.json();
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      'Unable to connect to the medical AI backend. Please verify that the server is running on http://127.0.0.1:8000.',
      'NETWORK_ERROR'
    );
  }
}

export const api = {
  getHealth: () => request<HealthResponse>('/health'),
  getSymptoms: () => request<SymptomsResponse>('/symptoms'),
  getModelInfo: () => request<ModelInfoResponse>('/model-info'),
  predict: (symptoms: string[]) =>
    request<PredictResponse>('/predict', {
      method: 'POST',
      body: JSON.stringify({ symptoms }),
    }),
};
