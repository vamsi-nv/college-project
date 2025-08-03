import { Outlet, useMatch, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { RiMenu2Fill } from "react-icons/ri";
import { useEffect, useState } from "react";
import RightSidebar from "../components/RightSidebar";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/UserContextProvider";
import { HiMiniUserCircle } from "react-icons/hi2";

function HomeLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTopBarVisible, setIsTopBarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isChatRoute = useMatch("/chat/*");

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY === 0) {
        setIsTopBarVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsTopBarVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsTopBarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [lastScrollY]);

  return (
    <div className={`min-h-screen relative flex bg-white`}>
      <motion.div
        className="fixed top-0 left-0 right-0 flex items-center justify-between z-30 p-3 text-gray-800  sm:hidden backdrop-blur-xl"
        initial={{ y: 0 }}
        animate={{
          y: isTopBarVisible ? 0 : -100,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <button onClick={() => setIsMobileMenuOpen(true)} className="">
          <RiMenu2Fill className="text-xl sm:text-2xl" />
        </button>
        <button onClick={() => navigate("/profile")} className="z-30">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              className="w-7 h-7 rounded-full"
              alt=""
            />
          ) : (
            <HiMiniUserCircle className="size-6 text-gray-300" />
          )}
        </button>
      </motion.div>

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
              className="fixed top-0 left-0 z-50 h-full w-64 bg-white sm:hidden"
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

      {!isChatRoute && (
        <div className="flex-4 max-md:hidden">
          <RightSidebar />
        </div>
      )}
    </div>
  );
}

export default HomeLayout;
