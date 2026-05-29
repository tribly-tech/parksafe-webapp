import { apiFetch } from './client'
import type { ContactRequest, ContactResponse } from '@parksafe/types'

/**
 * Sends an anonymous contact relay request.
 * Reporter identity is never included — only the issue type, channel, and optional note.
 * @param payload - Contact request payload
 * @param sessionId - Anonymous session ID for rate limiting
 */
export async function sendContactMessage(
  payload: ContactRequest,
  sessionId: string,
  authToken?: string
): Promise<ContactResponse> {
  const { tagId, ...body } = payload
  const headers: Record<string, string> = { 'X-Session-ID': sessionId }
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  return apiFetch<ContactResponse>(`/contact/${tagId}`, {
    method: 'POST',
    body: body as Record<string, unknown>,
    headers,
  })
}
