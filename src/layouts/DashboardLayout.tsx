import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeMenu = (): void => setMenuOpen(false)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-cream font-sans text-cacao">
      <Sidebar open={menuOpen} onClose={closeMenu} />

      {/* Fundo escurecido do drawer (somente abaixo de lg) */}
      <div
        onClick={closeMenu}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-cacao/60 transition-opacity duration-200 lg:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Header onOpenMenu={() => setMenuOpen(true)} />
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
