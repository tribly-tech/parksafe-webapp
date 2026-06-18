import type { RegisterVehicleFormInput } from '@parksafe/types'

const SIGN_IN_PHONE_KEY = 'parksafe-sign-in-phone'
const REGISTER_DRAFT_KEY = 'parksafe-register-draft'

interface RegisterDraftPayload {
  form: RegisterVehicleFormInput
  tagCode?: string
  /** Latest OTP from API in dev mode — invalidates on resend. */
  devOtp?: string
}

export function saveSignInPhone(digits: string): void {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.setItem(SIGN_IN_PHONE_KEY, digits)
}

export function loadSignInPhone(): string | null {
  if (typeof sessionStorage === 'undefined') return null
  return sessionStorage.getItem(SIGN_IN_PHONE_KEY)
}

export function clearSignInPhone(): void {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.removeItem(SIGN_IN_PHONE_KEY)
}

export function saveRegisterDraft(
  form: RegisterVehicleFormInput,
  tagCode?: string,
  devOtp?: string
): void {
  if (typeof sessionStorage === 'undefined') return
  const payload: RegisterDraftPayload = {
    form,
    ...(tagCode ? { tagCode } : {}),
    ...(devOtp ? { devOtp } : {}),
  }
  sessionStorage.setItem(REGISTER_DRAFT_KEY, JSON.stringify(payload))
}

export function updateRegisterDraftDevOtp(devOtp: string): void {
  const draft = loadRegisterDraft()
  if (!draft) return
  saveRegisterDraft(draft.form, draft.tagCode, devOtp)
}

export function loadRegisterDraft(): RegisterDraftPayload | null {
  if (typeof sessionStorage === 'undefined') return null
  const raw = sessionStorage.getItem(REGISTER_DRAFT_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as RegisterDraftPayload
  } catch {
    return null
  }
}

export function clearRegisterDraft(): void {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.removeItem(REGISTER_DRAFT_KEY)
}
