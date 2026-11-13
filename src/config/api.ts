import axios from 'axios'
import { AUTH_STORAGE_KEY, useAuthStore } from '../store/useAuthStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
})

/** Lê o token do formato persistido pelo Zustand: { state: { token } }. */
export function getStoredToken(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    const state = (parsed as { state?: unknown }).state
    if (typeof state !== 'object' || state === null) return null
    const token = (state as { token?: unknown }).token
    return typeof token === 'string' && token.length > 0 ? token : null
  } catch {
    return null
  }
}

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

// O token pode estar expirado/inválido: um 401 em requisição autenticada encerra a sessão local.
api.interceptors.response.use(undefined, (error: unknown) => {
  if (
    axios.isAxiosError(error) &&
    error.response?.status === 401 &&
    error.config?.headers.has('Authorization')
  ) {
    useAuthStore.getState().logout()
  }
  return Promise.reject(error)
})
