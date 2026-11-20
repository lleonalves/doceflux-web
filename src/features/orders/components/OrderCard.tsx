import { CalendarClock, MessageCircle, User } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { formatCurrency, formatDateTime } from '../../../lib/format'
import { nextStatuses, orderStatusPresentation, statusActionLabel } from '../orderStatus'
import type { Order, OrderStatus } from '../types'

const MAX_VISIBLE_ITEMS = 3

interface OrderCardProps {
  order: Order
  /** Telefone do cliente (o OrderResponse não o traz); habilita o atalho do WhatsApp. */
  phone?: string
  onChangeStatus: (order: Order, status: OrderStatus) => void
  isChangingStatus?: boolean
}

/** wa.me exige só dígitos; sem DDI assume Brasil (55) para números de até 11 dígitos. */
function whatsappUrl(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return null
  return `https://wa.me/${digits.length <= 11 ? `55${digits}` : digits}`
}

export function OrderCard({ order, phone, onChangeStatus, isChangingStatus }: OrderCardProps) {
  const status = orderStatusPresentation[order.status]
  const whatsapp = phone ? whatsappUrl(phone) : null
  const visibleItems = order.items.slice(0, MAX_VISIBLE_ITEMS)
  const hiddenCount = order.items.length - visibleItems.length
  const actions = nextStatuses[order.status]

  return (
    <Card tone="cream" className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <h2 className="flex min-w-0 items-center gap-2 text-lg font-semibold">
          <User size={18} strokeWidth={2.5} aria-hidden="true" className="shrink-0 text-rose-deep" />
          <span className="truncate" title={order.customerName}>
            {order.customerName}
          </span>
        </h2>
        <span
          className={`shrink-0 rounded-full border-2 border-cacao px-2.5 py-0.5 text-xs font-bold ${status.badgeClass}`}
        >
          {status.label}
        </span>
      </div>

      <p className="text-xs font-bold text-cacao/60">Pedido #{order.id.slice(0, 8)}</p>

      {whatsapp && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-w-0 items-center gap-2 font-bold text-sage-dark hover:underline"
        >
          <MessageCircle size={16} strokeWidth={2.5} aria-hidden="true" className="shrink-0" />
          <span className="truncate">{phone}</span>
        </a>
      )}

      <p className="flex items-center gap-1.5 text-sm font-semibold text-cacao/80">
        <CalendarClock size={16} strokeWidth={2.5} aria-hidden="true" />
        <time dateTime={order.createdAt}>{formatDateTime(order.createdAt)}</time>
      </p>

      {order.description && (
        <p className="line-clamp-2 text-sm break-words text-cacao/80">{order.description}</p>
      )}

      {order.items.length > 0 && (
        <ul className="space-y-1 rounded-xl border-2 border-cacao bg-beige px-3 py-2 text-sm">
          {visibleItems.map((item) => (
            <li key={item.id} className="flex gap-2">
              <span className="shrink-0 font-bold tabular-nums">{item.quantity}×</span>
              <span className="min-w-0 truncate">{item.name}</span>
            </li>
          ))}
          {hiddenCount > 0 && (
            <li className="font-bold text-rose-deep">
              +{hiddenCount} {hiddenCount === 1 ? 'item' : 'itens'}
            </li>
          )}
        </ul>
      )}

      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actions.map((next) => (
            <button
              key={next}
              type="button"
              onClick={() => onChangeStatus(order, next)}
              disabled={isChangingStatus}
              className={`min-h-11 flex-1 rounded-xl border-2 border-cacao px-3 font-bold shadow-cozy-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60 ${
                next === 'CANCELLED' ? 'bg-cream text-rose-deep' : 'bg-rose-deep text-cream'
              }`}
            >
              {statusActionLabel[next]}
            </button>
          ))}
        </div>
      )}

      <p className="mt-auto flex items-baseline justify-between gap-2 border-t-2 border-cacao/20 pt-3">
        <span className="text-sm font-bold text-cacao/80">Total</span>
        <span className="font-display text-2xl font-bold text-rose-deep tabular-nums">
          {formatCurrency(order.totalAmount)}
        </span>
      </p>
    </Card>
  )
}
