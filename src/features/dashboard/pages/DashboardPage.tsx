import {
  Cake,
  CakeSlice,
  Croissant,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { DemoBadge } from '../../../components/ui/DemoBadge'

interface Indicator {
  label: string
  value: string
  icon: LucideIcon
}

const overview: readonly Indicator[] = [
  { label: 'Produtos ativos', value: '24', icon: CakeSlice },
  { label: 'Clientes', value: '58', icon: Users },
  { label: 'Ticket médio', value: 'R$ 86,00', icon: Wallet },
]

export function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">Início</h1>
        <DemoBadge />
      </div>
      <p className="text-sm text-cacao/80">
        Os valores abaixo são apenas ilustrativos para validar o visual da aplicação.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card tone="cream" aria-labelledby="card-day" className="relative overflow-hidden">
          <Cake
            size={72}
            strokeWidth={2}
            aria-hidden="true"
            className="absolute -top-3 -right-3 rotate-12 text-rose-soft/40"
          />
          <h2 id="card-day" className="relative text-lg font-semibold">
            Resumo do dia
          </h2>
          <p className="mt-3 text-sm font-semibold text-cacao/80">Faturamento</p>
          <p className="font-display text-4xl font-bold text-rose-deep tabular-nums">
            R$ 1.234,56
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-sage-dark">
            <TrendingUp size={16} strokeWidth={2.5} aria-hidden="true" />
            +12% em relação a ontem
          </p>
        </Card>

        <Card tone="beige" aria-labelledby="card-orders">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl border-2 border-cacao bg-sage text-cream">
              <Truck size={22} strokeWidth={2.5} aria-hidden="true" />
            </span>
            <h2 id="card-orders" className="text-lg font-semibold">
              Pedidos para entregar
            </h2>
          </div>
          <p className="mt-4 font-display text-5xl font-bold tabular-nums">7</p>
          <div className="mt-3 h-3 overflow-hidden rounded-full border-2 border-cacao bg-cream">
            <div className="h-full w-2/3 bg-sage" />
          </div>
          <p className="mt-2 text-sm font-semibold text-cacao/80">4 de 7 já estão prontos</p>
        </Card>

        <Card
          tone="cream"
          aria-labelledby="card-overview"
          className="md:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center gap-2">
            <Croissant size={22} strokeWidth={2.5} aria-hidden="true" className="text-rose-deep" />
            <h2 id="card-overview" className="text-lg font-semibold">
              Visão geral
            </h2>
          </div>
          <ul className="mt-3 space-y-2">
            {overview.map(({ label, value, icon: Icon }) => (
              <li
                key={label}
                className="flex items-center justify-between gap-3 rounded-xl border-2 border-cacao bg-beige px-3 py-2"
              >
                <span className="flex items-center gap-2 text-sm font-bold">
                  <Icon size={18} strokeWidth={2.5} aria-hidden="true" className="text-rose-deep" />
                  {label}
                </span>
                <span className="font-display text-lg font-semibold tabular-nums">{value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
