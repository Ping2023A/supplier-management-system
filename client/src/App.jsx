import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";

import DashboardPage from "./features/dashboard/DashboardPage";
import SuppliersPage from "./features/suppliers/SuppliersPage";

function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/suppliers" element={<SuppliersPage />} />
      </Routes>
    </DashboardLayout>
  );
}

export default App;