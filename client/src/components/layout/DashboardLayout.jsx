import Sidebar from "../common/Sidebar";
import Header from "../common/Header";

const DashboardLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />

      <div className="page-body">
        <Sidebar />
        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;