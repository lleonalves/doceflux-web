import axios from 'axios'
import { api } from '../../config/api'
import type { User } from '../../store/useAuthStore'

export interface LoginCredentials {
  email: string
  password: string
}

/** Contrato de POST /api/auth/login (AuthResponse do backend). */
interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  userId: string
  email: string
  role: string
  storeId: string
  storeName: string
  mainManager: string
  responsibleManager: string
  companyStartDate: string
}

export interface LoginResult {
  token: string
  user: User
}

export interface RegisterPayload {
  storeName: string
  mainManager: string
  responsibleManager: string
  companyStartDate: string
  email: string
  password: string
  inviteCode?: string
}

function toLoginResult(data: LoginResponse): LoginResult {
  return {
    token: data.accessToken,
    user: {
      id: data.userId,
      email: data.email,
      role: data.role,
      storeId: data.storeId,
      storeName: data.storeName,
    },
  }
}

export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  const { data } = await api.post<LoginResponse>('/api/auth/login', credentials)
  return toLoginResult(data)
}

/** POST /api/auth/register devolve o mesmo AuthResponse do login. */
export async function register(payload: RegisterPayload): Promise<LoginResult> {
  const { data } = await api.post<LoginResponse>('/api/auth/register', payload)
  return toLoginResult(data)
}

export function getRegisterErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Não foi possível conectar ao servidor.'
    const detail = error.response.data?.detail
    if ([400, 403].includes(error.response.status) && typeof detail === 'string') return detail
  }
  return 'Não foi possível criar a conta. Tente novamente.'
}

/** Valida a sessão atual no backend (GET /api/auth/me). */
export async function fetchSession(): Promise<void> {
  await api.get('/api/auth/me')
}

export function getLoginErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return 'O servidor demorou para responder. Tente novamente.'
    }
    if (!error.response) return 'Não foi possível conectar ao servidor.'
    switch (error.response.status) {
      case 401:
        return 'E-mail ou senha incorretos.'
      case 403:
        return 'Acesso não autorizado.'
      case 500:
        return 'Ocorreu um erro interno. Tente novamente.'
    }
  }
  return 'Não foi possível entrar. Tente novamente.'
}
