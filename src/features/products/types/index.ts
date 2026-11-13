/** Contrato de GET /api/products (ProductResponse do backend). */
export interface Product {
  id: string
  name: string
  /** Coluna TEXT sem NOT NULL no backend: pode vir nulo. */
  description: string | null
  price: number
  active: boolean
  /** Instant em ISO-8601 (UTC). */
  createdAt: string
  updatedAt: string
}

export type ProductStatusFilter = 'all' | 'active' | 'inactive'
