import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";

import DashboardPage from "./features/dashboard/DashboardPage";
import SuppliersPage from "./features/suppliers/SuppliersPage";
import OrdersPage from "./features/orders/OrdersPage";
import DeliveriesPage from "./features/deliveries/DeliveriesPage";
import ReportsPage from "./features/reports/ReportsPage";
import SettingsPage from "./features/settings/SettingsPage";

function App() {
  return (
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
  );
}

export default App;