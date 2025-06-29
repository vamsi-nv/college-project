import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { RiMenu2Fill } from "react-icons/ri";
import { useState } from "react";
import RightSidebar from "../components/RightSidebar";

function HomeLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div
      className={`min-h-screen relative flex bg-gray-100 ${
        isMobileMenuOpen && "overflow-y-hidden"
      }`}
    >
      <div className="">
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      </div>

      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed z-30 text-gray-800 top-4 left-4 sm:hidden"
      >
        <RiMenu2Fill className="text-2xl" />
      </button>

      {isMobileMenuOpen && (
        <div
          className="absolute inset-0 z-20 bg-neutral-300/20 backdrop-blur-xl"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <div className="border-gray-200 flex-6 xl:flex-5 border-x">
        <Outlet />
      </div>
      <div className="flex-4 max-md:hidden">
        <RightSidebar />
      </div>
    </div>
  );
}

export default HomeLayout;
