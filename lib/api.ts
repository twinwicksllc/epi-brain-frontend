const rawApiRoot = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
export const API_ROOT = rawApiRoot.replace(/\/+$/, '');
export const API_BASE = API_ROOT.includes(`/api/${API_VERSION}`)
  ? API_ROOT
  : `${API_ROOT}/api/${API_VERSION}`;

export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { parseAsText?: boolean } = {}
): Promise<T> {
  const versionSegment = `/api/${API_VERSION}`;
  const absoluteUrlPattern = /^https?:\/\//i;
  const isAbsoluteUrl = absoluteUrlPattern.test(path);
  let normalizedPath = path;

  if (!isAbsoluteUrl) {
    normalizedPath = path.startsWith('/') ? path : `/${path}`;
    if (API_BASE.endsWith(versionSegment) && normalizedPath.startsWith(versionSegment)) {
      const trimmed = normalizedPath.slice(versionSegment.length);
      normalizedPath = trimmed ? (trimmed.startsWith('/') ? trimmed : `/${trimmed}`) : '/';
    }
  }

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const requestUrl = isAbsoluteUrl ? normalizedPath : `${API_BASE}${normalizedPath}`;
  const response = await fetch(requestUrl, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const shouldParseJson = contentType.includes('application/json') && !options.parseAsText;

  const data = shouldParseJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error: ApiError = new Error(
      typeof data === 'string'
        ? data
        : (data as { detail?: string; message?: string })?.detail ||
          (data as { message?: string })?.message ||
          'Request failed'
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data as T;
}
