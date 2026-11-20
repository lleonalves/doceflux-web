import type { OrderStatus } from './types'

interface StatusPresentation {
  label: string
  /** Classes Tailwind do selo (fundo + texto). */
  badgeClass: string
}

/** Mapeamento centralizado de apresentação por status; o Record exige cobrir todo o enum. */
export const orderStatusPresentation: Record<OrderStatus, StatusPresentation> = {
  PENDING: { label: 'Pendente', badgeClass: 'bg-beige text-cacao' },
  IN_PRODUCTION: { label: 'Em produção', badgeClass: 'bg-rose-soft text-cacao' },
  COMPLETED: { label: 'Concluído', badgeClass: 'bg-sage-dark text-cream' },
  CANCELLED: { label: 'Cancelado', badgeClass: 'bg-cacao text-cream' },
}

/** Espelha OrderStatus.canTransitionTo do backend. */
export const nextStatuses: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['IN_PRODUCTION', 'CANCELLED'],
  IN_PRODUCTION: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
}

export const statusActionLabel: Record<OrderStatus, string> = {
  PENDING: 'Reabrir',
  IN_PRODUCTION: 'Iniciar produção',
  COMPLETED: 'Concluir',
  CANCELLED: 'Cancelar',
}
