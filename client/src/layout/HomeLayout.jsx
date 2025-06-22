import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function HomeLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default HomeLayout;
