import { Routes, Route } from "react-router-dom";
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
      {/* LOGIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* PROTECTED APP */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/suppliers" element={<SuppliersPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/deliveries" element={<DeliveriesPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;