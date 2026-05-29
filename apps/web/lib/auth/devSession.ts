/**
 * Local-only dev auth bypass — pairs with API dev-session tokens (OTP_DEV_MODE).
 */

export const DEV_AUTH_USER_ID = '00000000-0000-0000-0000-000000000010'

export const DEV_AUTH_TOKEN = `dev-session:${DEV_AUTH_USER_ID}`

export function isDevAuthBypassEnabled(): boolean {
  if (process.env.NODE_ENV !== 'development') return false
  return process.env.NEXT_PUBLIC_DEV_SKIP_AUTH !== 'false'
}

export function getDevAuthCredentials(): { token: string; userId: string } {
  return { token: DEV_AUTH_TOKEN, userId: DEV_AUTH_USER_ID }
}

export function isDevAuthToken(token: string | null): boolean {
  return token?.startsWith('dev-session:') ?? false
}

const SIGNED_OUT_SESSION_KEY = 'parksafe-signed-out'

/** Marks that the user explicitly signed out — blocks dev auto-login until next sign-in. */
export function markExplicitSignOut(): void {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(SIGNED_OUT_SESSION_KEY, '1')
  }
}

export function clearExplicitSignOut(): void {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(SIGNED_OUT_SESSION_KEY)
  }
}

export function hasExplicitSignOut(): boolean {
  if (typeof sessionStorage === 'undefined') return false
  return sessionStorage.getItem(SIGNED_OUT_SESSION_KEY) === '1'
}
