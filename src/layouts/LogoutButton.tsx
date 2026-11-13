import { Check, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'

const CONFIRM_WINDOW_MS = 3000

/** Logout em duas etapas: o primeiro toque pede confirmação, o segundo encerra a sessão. */
export function LogoutButton() {
  const logout = useAuthStore((state) => state.logout)
  const [confirming, setConfirming] = useState<boolean>(false)

  useEffect(() => {
    if (!confirming) return
    const timer = window.setTimeout(() => setConfirming(false), CONFIRM_WINDOW_MS)
    return () => window.clearTimeout(timer)
  }, [confirming])

  const handleClick = (): void => {
    if (confirming) {
      logout()
    } else {
      setConfirming(true)
    }
  }

  const Icon = confirming ? Check : LogOut

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-live="polite"
      className={`flex min-h-11 w-full items-center gap-3 rounded-xl border-2 border-cacao px-3 py-2 text-left font-bold transition duration-200 hover:-translate-y-0.5 ${
        confirming
          ? 'bg-rose-soft text-cacao shadow-cozy-sm'
          : 'bg-rose-deep text-cream hover:bg-cacao/40'
      }`}
    >
      <Icon size={20} strokeWidth={2.5} aria-hidden="true" />
      {confirming ? 'Toque para confirmar' : 'Sair'}
    </button>
  )
}
