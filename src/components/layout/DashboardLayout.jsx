import Sidebar from "../common/Sidebar";
import Header from "../common/Header";

const DashboardLayout = ({ children, activePage }) => {
  return (
    <div className="layout">
      <Sidebar activePage={activePage} />

      <div className="main">
        <Header />
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;