import { CalendarDays, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
})
const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

function getGreeting(date: Date): string {
  const hour = date.getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

function useNow(intervalMs: number): Date {
  const [now, setNow] = useState<Date>(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs])
  return now
}

interface HeaderProps {
  onOpenMenu: () => void
}

export function Header({ onOpenMenu }: HeaderProps) {
  const now = useNow(15_000)

  return (
    <header className="flex items-center justify-between gap-3 border-b-2 border-cacao bg-beige px-4 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menu"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border-2 border-cacao bg-cream shadow-cozy-sm transition hover:-translate-y-0.5 lg:hidden"
        >
          <Menu size={22} strokeWidth={2.5} aria-hidden="true" />
        </button>
        <div className="min-w-0">
          <p className="truncate font-display text-xl font-semibold sm:text-2xl">
            {getGreeting(now)}!
          </p>
          <p className="hidden truncate text-sm text-cacao/80 sm:block">
            Que bom ter você por aqui.
          </p>
        </div>
      </div>

      <time
        dateTime={now.toISOString()}
        className="flex shrink-0 items-center gap-2 rounded-xl border-2 border-cacao bg-cacao px-3 py-1.5 text-cream shadow-cozy-sm"
      >
        <CalendarDays size={18} strokeWidth={2.5} aria-hidden="true" className="hidden sm:block" />
        <span className="hidden text-sm font-semibold capitalize sm:inline">
          {dateFormatter.format(now)}
        </span>
        <span className="font-display text-lg font-semibold tabular-nums">
          {timeFormatter.format(now)}
        </span>
      </time>
    </header>
  )
}
