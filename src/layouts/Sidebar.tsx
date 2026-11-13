import { Cake, Cookie, Wheat, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { LogoutButton } from './LogoutButton'
import { navItems } from './navigation'

interface SidebarProps {
  /** Só tem efeito abaixo de lg, onde a sidebar funciona como drawer. */
  open: boolean
  onClose: () => void
}

/** Única sidebar da aplicação: fixa a partir de lg, drawer deslizante abaixo disso. */
export function Sidebar({ open, onClose }: SidebarProps) {
  const storeName = useAuthStore((state) => state.user?.storeName)

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 max-w-[85vw] shrink-0 flex-col gap-6 border-r-2 border-cacao bg-rose-deep p-4 text-cream transition-[transform,visibility] duration-200 lg:static lg:visible lg:max-w-none lg:translate-x-0 ${
        open ? 'visible translate-x-0' : 'invisible -translate-x-full'
      }`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar menu"
        className="absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full border-2 border-cacao bg-cream text-cacao lg:hidden"
      >
        <X size={18} strokeWidth={2.5} aria-hidden="true" />
      </button>

      {/* Placa artesanal */}
      <div className="relative mt-2 rounded-2xl border-2 border-cacao bg-beige p-4 pt-5 text-cacao shadow-cozy">
        <Wheat
          size={22}
          strokeWidth={2.5}
          aria-hidden="true"
          className="absolute -top-3 left-4 rounded-full border-2 border-cacao bg-sage p-0.5 text-cream"
        />
        <Cookie
          size={22}
          strokeWidth={2.5}
          aria-hidden="true"
          className="absolute -top-3 right-4 rounded-full border-2 border-cacao bg-rose-soft p-0.5 text-cacao"
        />
        <p className="flex items-center gap-1.5 text-xs font-extrabold tracking-widest text-rose-deep uppercase">
          <Cake size={14} strokeWidth={2.5} aria-hidden="true" />
          DoceFlux
        </p>
        <p className="mt-1 font-display text-xl leading-tight font-semibold break-words">
          {storeName ?? 'Minha confeitaria'}
        </p>
      </div>

      <nav aria-label="Navegação principal" className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map(({ label, to, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-3 rounded-xl border-2 px-3 py-2 font-bold transition duration-200 hover:-translate-y-0.5 ${
                    isActive
                      ? 'border-cacao bg-cream text-rose-deep shadow-cozy-sm'
                      : 'border-transparent text-cream/90 hover:bg-cacao/30'
                  }`
                }
              >
                <Icon size={20} strokeWidth={2.5} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <LogoutButton />
    </aside>
  )
}
