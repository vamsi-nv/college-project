import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { RiMenu2Fill } from "react-icons/ri";
import { useEffect, useState } from "react";
import RightSidebar from "../components/RightSidebar";
import { motion, AnimatePresence } from "motion/react";

function HomeLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  return (
    <div className={`min-h-screen relative flex bg-gray-50`}>

      <div className="fixed top-0 left-0 right-0 z-30 p-3 text-gray-800 bg-gray-50/90 sm:hidden backdrop-blur-xl ">
        <button onClick={() => setIsMobileMenuOpen(true)} className="">
          <RiMenu2Fill className="text-xl sm:text-2xl" />
        </button>
      </div>

      {/* mobile sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
           
            <motion.div
              key="sidebar-overlay"
              className="fixed inset-0 z-40 bg-neutral-300/20 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              key="sidebar"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 z-50 h-full w-64 bg-gray-50 sm:hidden"
            >
              <Sidebar
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* desktop sidebar */}
      <div className="hidden sm:block">
        <Sidebar />
      </div>

      <div className={`border-gray-300 flex-6 xl:flex-5 sm:border-x`}>
        <Outlet />
      </div>
      <div className="flex-4 max-md:hidden">
        <RightSidebar />
      </div>
    </div>
  );
}

export default HomeLayout;
