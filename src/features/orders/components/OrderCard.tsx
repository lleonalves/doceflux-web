import { CalendarClock, User } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { formatCurrency, formatDateTime } from '../../../lib/format'
import { orderStatusPresentation } from '../orderStatus'
import type { Order } from '../types'

const MAX_VISIBLE_ITEMS = 3

export function OrderCard({ order }: { order: Order }) {
  const status = orderStatusPresentation[order.status]
  const visibleItems = order.items.slice(0, MAX_VISIBLE_ITEMS)
  const hiddenCount = order.items.length - visibleItems.length

  return (
    <Card tone="cream" className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <h2 className="flex min-w-0 items-center gap-2 text-lg font-semibold">
          <User size={18} strokeWidth={2.5} aria-hidden="true" className="shrink-0 text-rose-deep" />
          <span className="truncate">{order.customerName}</span>
        </h2>
        <span
          className={`shrink-0 rounded-full border-2 border-cacao px-2.5 py-0.5 text-xs font-bold ${status.badgeClass}`}
        >
          {status.label}
        </span>
      </div>

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

      <p className="mt-auto flex items-baseline justify-between gap-2 border-t-2 border-cacao/20 pt-3">
        <span className="text-sm font-bold text-cacao/80">Total</span>
        <span className="font-display text-2xl font-bold text-rose-deep tabular-nums">
          {formatCurrency(order.totalAmount)}
        </span>
      </p>
    </Card>
  )
}
