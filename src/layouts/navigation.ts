import {
  DollarSign,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Users,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export const navItems: readonly NavItem[] = [
  { label: 'Início', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Pedidos', to: '/orders', icon: ShoppingBag },
  { label: 'Produtos', to: '/products', icon: Package },
  { label: 'Clientes', to: '/customers', icon: Users },
  { label: 'Financeiro', to: '/finance', icon: DollarSign },
  { label: 'Configurações', to: '/settings', icon: Settings },
]
