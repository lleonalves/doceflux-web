import { api } from '../../../config/api'
import type { Profile, UpdatePasswordPayload, UpdateProfilePayload } from '../types'

export async function getProfile(): Promise<Profile> {
  const { data } = await api.get<Profile>('/api/settings/profile')
  return data
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<Profile> {
  const { data } = await api.put<Profile>('/api/settings/profile', payload)
  return data
}

export async function updatePassword(payload: UpdatePasswordPayload): Promise<void> {
  await api.patch('/api/settings/password', payload)
}
