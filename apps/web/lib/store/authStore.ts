'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { clearExplicitSignOut, markExplicitSignOut } from '@/lib/auth/devSession'

interface AuthState {
  token: string | null
  userId: string | null
  isAuthenticated: boolean
  /** True after localStorage rehydration — not persisted. */
  hasHydrated: boolean
  setSession: (token: string, userId: string) => void
  clearSession: () => void
  setHasHydrated: (value: boolean) => void
}

/**
 * Global auth state — persisted to localStorage for session continuity.
 * Only the JWT token and user ID are stored — never phone numbers or PII.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      token: null,
      userId: null,
      isAuthenticated: false,
      hasHydrated: false,

      setSession: (token: string, userId: string) => {
        clearExplicitSignOut()
        set({ token, userId, isAuthenticated: true })
      },

      clearSession: () => {
        markExplicitSignOut()
        set({ token: null, userId: null, isAuthenticated: false })
      },

      setHasHydrated: (value: boolean) => set({ hasHydrated: value }),
    }),
    {
      name: 'parksafe-auth',
      partialize: state => ({ token: state.token, userId: state.userId }),
      onRehydrateStorage: () => () => {
        const { token } = useAuthStore.getState()
        useAuthStore.setState({
          hasHydrated: true,
          isAuthenticated: Boolean(token),
        })
      },
    }
  )
)
