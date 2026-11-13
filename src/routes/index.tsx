import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../features/auth/LoginPage'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { OrdersPage } from '../features/orders/pages/OrdersPage'
import { NotFoundPage } from '../features/shared/pages/NotFoundPage'
import { PlaceholderPage } from '../features/shared/pages/PlaceholderPage'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { PublicOnly, RequireAuth } from './guards'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicOnly />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/products" element={<PlaceholderPage title="Produtos" />} />
          <Route path="/customers" element={<PlaceholderPage title="Clientes" />} />
          <Route path="/finance" element={<PlaceholderPage title="Financeiro" />} />
          <Route path="/settings" element={<PlaceholderPage title="Configurações" />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
