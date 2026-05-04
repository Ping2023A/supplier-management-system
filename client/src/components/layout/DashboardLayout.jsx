import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";

const DashboardLayout = () => (
  <div className="app-layout">
    <Header />
    <div className="page-body">
      <Sidebar />
      <main className="content">
        <Outlet /> {/* ✅ renders child routes */}
      </main>
    </div>
  </div>
);

export default DashboardLayout;
