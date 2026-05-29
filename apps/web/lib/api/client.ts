/**
 * apps/web/lib/api/client.ts
 * Typed fetch wrapper — base for all API calls in the frontend.
 * All errors are typed and handled. Components never call fetch directly.
 */

/**
 * Resolves the API base URL.
 * Browser requests use the same-origin /backend proxy (avoids CSP + CORS issues).
 * Server-side calls use the direct API URL.
 */
function getApiBase(): string {
  if (typeof window !== 'undefined') {
    return '/backend'
  }
  return process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001'
}

/** Typed API error — carries HTTP status and optional error code. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown>
}

/**
 * Makes a typed fetch request to the ParkSafe API.
 * Throws ApiError on non-2xx responses — never throws untyped errors.
 * @param path - API path relative to API_BASE (e.g. /tags/abc-123)
 * @param options - Fetch options with typed body
 */
export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options

  const res = await fetch(`${getApiBase()}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new ApiError(
      (errorData as { error?: string }).error ?? `HTTP ${res.status}`,
      res.status,
      (errorData as { code?: string }).code
    )
  }

  return res.json() as Promise<T>
}
