import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./features/auth/LoginPage";

import DashboardPage from "./features/dashboard/DashboardPage";
import SuppliersPage from "./features/suppliers/SuppliersPage";
import OrdersPage from "./features/orders/OrdersPage";
import DeliveriesPage from "./features/deliveries/DeliveriesPage";
import ReportsPage from "./features/reports/ReportsPage";
import SettingsPage from "./features/settings/SettingsPage";

function App() {
  return (
    <Routes>
      {/* Root route: redirect "/" to "/login" */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* LOGIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* PROTECTED APP */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Index route renders DashboardPage when visiting /dashboard */}
        <Route index element={<DashboardPage />} />

        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="deliveries" element={<DeliveriesPage />} />
        <Route path="reports" element={<ReportsPage />} />

        {/* Admin-only route */}
        <Route
          path="settings"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all route for unknown paths */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
