/** Contrato de GET /api/customers (CustomerResponse do backend). */
export interface Customer {
  id: string
  name: string
  phone: string
  email: string | null
  address: string | null
  /** Instant em ISO-8601 (UTC). */
  createdAt: string
}

/** Payload de POST/PUT /api/customers (CustomerRequest): sem id nem tenant. */
export interface CreateCustomerPayload {
  name: string
  phone: string
  email?: string
  address?: string
}

export type UpdateCustomerPayload = CreateCustomerPayload
