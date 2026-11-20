import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../features/auth/LoginPage'
import { RegisterPage } from '../features/auth/RegisterPage'
import CustomersPage from '../features/customers/pages/CustomersPage'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { FinancePage } from '../features/finance/pages/FinancePage'
import { OrdersPage } from '../features/orders/pages/OrdersPage'
import ProductsPage from '../features/products/pages/ProductsPage'
import { NotFoundPage } from '../features/shared/pages/NotFoundPage'
import { PlaceholderPage } from '../features/shared/pages/PlaceholderPage'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { PublicOnly, RequireAuth } from './guards'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicOnly />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/settings" element={<PlaceholderPage title="Configurações" />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
