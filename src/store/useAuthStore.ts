import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const AUTH_STORAGE_KEY = 'auth-storage'

export interface User {
  id: string
  email: string
  role: string
  storeName: string
}

interface AuthState {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token: string, user: User): void => {
        set({ token, user })
      },
      logout: (): void => {
        set({ token: null, user: null })
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      // Persiste somente os dados; estrutura: { state: { token, user }, version }
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
)
