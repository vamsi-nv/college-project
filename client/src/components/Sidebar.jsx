import { NavLink } from "react-router-dom";
import { FiHome, FiCompass, FiBell, FiUser, FiLogOut } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { useAuth } from "../context/UserContextProvider";

function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const { logout, user } = useAuth();

  const navItems = [
    {
      label: "Home",
      path: "/",
      icon: FiHome,
    },
    {
      label: "Explore",
      path: "/explore",
      icon: FiCompass,
    },
    {
      label: "Notifications",
      path: "/notifications",
      icon: FiBell,
    },
    {
      label: "Clubs",
      path: "/clubs",
      icon: LuUsers,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: FiUser,
    },
  ];

  return (
    <section
      className={`min-h-screen bg-gray-100 lg:ml-30 border-r border-gray-300 p-4 lg:p-8 transfrom transition-transform duration-300 ease-in-out flex flex-col items-start ${
        isMobileMenuOpen
          ? "absolute z-50 translate-x-0"
          : "md:block max-sm:hidden max-sm:-translate-x-full"
      }`}
    >
      <div className="flex flex-col group">
        {navItems.map(({ label, path, icon: Icon }) => (
          <div
            className="relative"
            onClick={() => setIsMobileMenuOpen(false)}
            key={path}
          >
            <NavLink
              to={path}
              className={({ isActive }) =>
                `flex items-center ${
                  !isMobileMenuOpen && "max-xl:justify-center"
                } gap-3 text-base mb-4 p-4 transition-all duration-100 rounded-lg ${
                  isActive ? "bg-primary" : "hover:bg-gray-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`size-5 lg:size-6 transition-all duration-200 ${
                      isActive ? "stroke-2 text-white" : "stroke-gray-500"
                    }`}
                  />
                  <span
                    className={`${
                      isMobileMenuOpen ? "max-sm:block" : ""
                    } hidden xl:flex-1 xl:block transition-all duration-200 ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </div>
        ))}
      </div>

      <button
        onClick={logout}
        className={`flex items-center gap-3 text-base p-4 text-gray-500 hover:gap-4 hover:text-neutral-950 transition-all duration-200`}
      >
        <FiLogOut className="h-5 w-5 max-xl:flex-1" />
        <span
          className={`${
            isMobileMenuOpen ? "max-sm:block" : ""
          }  hidden xl:flex-1 xl:block`}
        >
          Logout
        </span>
      </button>
    </section>
  );
}

export default Sidebar;
