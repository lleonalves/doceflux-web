/** Contrato de GET/PUT /api/settings/profile (ProfileResponse do backend). */
export interface Profile {
  storeName: string
  mainManager: string
  responsibleManager: string
  email: string
  /** Data ISO (yyyy-MM-dd). */
  companyStartDate: string
}

/** Payload de PUT /api/settings/profile: o e-mail não é editável. */
export interface UpdateProfilePayload {
  storeName: string
  mainManager: string
  responsibleManager: string
}

/** Payload de PATCH /api/settings/password. */
export interface UpdatePasswordPayload {
  currentPassword: string
  newPassword: string
}
