import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { RiMenu2Fill } from "react-icons/ri";
import { useState } from "react";
import RightSidebar from "../components/RightSidebar";

function HomeLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen relative flex bg-gray-100`}>
      <div>
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      </div>

      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-30 sm:hidden text-gray-800"
      >
        <RiMenu2Fill className="text-2xl" />
      </button>

      {isMobileMenuOpen && (
        <div
          className="inset-0 z-20 absolute bg-neutral-400/40"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <div className="flex-5 overflow-y-auto">
        <Outlet />
      </div>
      <div className="flex-4 max-md:hidden border-l border-gray-300">
        <RightSidebar />
      </div>
    </div>
  );
}

export default HomeLayout;
