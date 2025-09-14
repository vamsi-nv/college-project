import { useEffect, useState } from "react";
import logo from "../../assets/globe.png";
import { LuUsers } from "react-icons/lu";
import { TbPresentationAnalytics } from "react-icons/tb";
import { Link, NavLink, Outlet } from "react-router-dom";
import { RiMenu2Fill } from "react-icons/ri";
import { MdOutlineEventNote } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/UserContextProvider";
function Admin() {
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [
    {
      label: "Dashboard",
      path: "dashboard",
      icon: TbPresentationAnalytics,
    },
    {
      label: "Clubs",
      path: "clubs",
      icon: LuUsers,
    },
    {
      label: "Events",
      path: "events",
      icon: MdOutlineEventNote,
    },
  ];
  const handleLogout = async () => {
    try {
      logout();
    } catch (error) {
      console.error("error : ", error);
    }
  };

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
    <div className={`min-h-screen relative flex bg-white `}>
      <div className="relative">
        <div
          className={`min-h-screen top-0 lg:w-60 p-4 bg-white lg:ml-10 xl:ml-25 lg:p-8 flex flex-col items-start ${
            isMobileMenuOpen
              ? "fixed z-50 translate-x-0"
              : "sm:block md:block hidden max-sm:-translate-x-full sticky"
          }`}
        >
          <div className="flex items-center gap-1 px-2 mb-5">
            <img src={logo} alt="logo" className="w-10" />
            <h2
              className={`hidden font-medium text-xl lg:block ${
                isMobileMenuOpen && "max-sm:block"
              }`}
            >
              CSphere
            </h2>
          </div>
          <div className="flex flex-col">
            {navItems.map(({ label, path, icon: Icon }) => (
              <div
                className="relative"
                onClick={() => setIsMobileMenuOpen(false)}
                key={path}
              >
                <NavLink
                  end
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center ${
                      !isMobileMenuOpen && "max-xl:justify-center"
                    } gap-3 text-base mb-4 p-4 transition-all duration-100 rounded-lg ${
                      isActive ? "bg-primary/10" : "hover:bg-gray-200/50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`size-5  lg:size-6 transition-all duration-200 ${
                          isActive ? " text-primary" : "text-gray-500"
                        }`}
                      />
                      <span
                        className={`${
                          isMobileMenuOpen ? "max-sm:block" : ""
                        } hidden lg:flex-1 lg:block transition-all duration-200 ${
                          isActive
                            ? "text-primary font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {label}
                      </span>
                    </>
                  )}
                </NavLink>
              </div>
            ))}
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 text-base p-4 mb-4 text-red-500  hover:bg-red-500/10 hover:ring hover:gap-5  transition-all duration-200 rounded-lg`}
            >
              <FiLogOut className="size-5" />
              <span
                className={`${
                  isMobileMenuOpen ? "max-sm:block" : ""
                }  hidden lg:flex-1 text-left lg:block`}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="fixed top-0 left-0 right-0 z-30 p-3 text-gray-800 bg-gray-50/90 sm:hidden backdrop-blur-xl ">
        <button onClick={() => setIsMobileMenuOpen(true)} className="">
          <RiMenu2Fill className="text-2xl" />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          className="absolute inset-0 z-40 bg-neutral-300/20 backdrop-blur-xl"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <div className="min-h-screen border-gray-300 flex-6 xl:flex-5 border-x">
        <Outlet />
      </div>
    </div>
  );
}

export default Admin;
