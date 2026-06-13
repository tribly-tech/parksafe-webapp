'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AdminState {
  apiKey: string | null
  setApiKey: (key: string) => void
  clearApiKey: () => void
}

export const useAdminStore = create<AdminState>()(
  persist(
    set => ({
      apiKey: null,
      setApiKey: apiKey => set({ apiKey }),
      clearApiKey: () => set({ apiKey: null }),
    }),
    {
      name: 'parksafe-admin',
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => ({ apiKey: state.apiKey }),
    }
  )
)
