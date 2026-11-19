import { Edit2, Mail, MapPin, MessageCircle, Trash2 } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import type { Customer } from '../types'

interface CustomerCardProps {
  customer: Customer
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
  isDeleting?: boolean
}

/** wa.me exige só dígitos; sem DDI assume Brasil (55) para números de até 11 dígitos. */
function whatsappUrl(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return null
  return `https://wa.me/${digits.length <= 11 ? `55${digits}` : digits}`
}

export function CustomerCard({ customer, onEdit, onDelete, isDeleting }: CustomerCardProps) {
  const whatsapp = whatsappUrl(customer.phone)
  const email = customer.email?.trim()
  const address = customer.address?.trim()

  return (
    <Card tone="cream" className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <h2 className="min-w-0 flex-1 truncate text-lg leading-tight font-semibold" title={customer.name}>
          {customer.name}
        </h2>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onEdit(customer)}
            aria-label={`Editar ${customer.name}`}
            className="flex size-8 items-center justify-center rounded-lg border-2 border-cacao bg-beige shadow-cozy-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <Edit2 size={14} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(customer)}
            disabled={isDeleting}
            title="Excluir cliente"
            aria-label={`Excluir ${customer.name}`}
            className="flex size-8 items-center justify-center rounded-lg border-2 border-cacao bg-cream text-rose-deep shadow-cozy-sm transition-all hover:bg-rose-deep hover:text-cream active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
          >
            <Trash2 size={14} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      {whatsapp ? (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-w-0 items-center gap-2 font-bold text-sage-dark hover:underline"
        >
          <MessageCircle size={16} strokeWidth={2.5} aria-hidden="true" className="shrink-0" />
          <span className="truncate">{customer.phone}</span>
        </a>
      ) : (
        <p className="truncate font-bold">{customer.phone}</p>
      )}

      {email && (
        <p className="flex min-w-0 items-center gap-2 text-sm text-cacao/80">
          <Mail size={14} aria-hidden="true" className="shrink-0" />
          <span className="truncate">{email}</span>
        </p>
      )}

      {address && (
        <p className="flex min-w-0 items-start gap-2 text-sm text-cacao/80">
          <MapPin size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
          <span className="line-clamp-2 break-words">{address}</span>
        </p>
      )}
    </Card>
  )
}
