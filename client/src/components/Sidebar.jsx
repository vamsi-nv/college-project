import { NavLink } from "react-router-dom";
import { FiHome, FiCompass, FiBell, FiUser, FiLogOut } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { useAuth } from "../context/UserContextProvider";

function Sidebar() {
  const { logout } = useAuth();

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
      label : "Clubs",
      path: "/clubs",
      icon : LuUsers
    },
    {
      label: "Profile",
      path: "/profile",
      icon: FiUser,
    },
  ];

  return (
    <div className="min-h-screen border-r border-gray-300 px-8 py-8">
      <div className="flex flex-col group">
        {navItems.map(({ label, path, icon: Icon }) => (
          <div className="relative group" key={path}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 text-base mb-4 p-4 transition-all duration-100 rounded-lg ${
                  isActive ? "bg-neutral-900" : "hover:bg-gray-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`size-6 max-xl:size-6 transition-all duration-200 ${
                      isActive ? "stroke-2 text-white" : "stroke-gray-500"
                    }`}
                  />
                  <span
                    className={`hidden xl:flex-1 xl:block transition-all duration-200 ${
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
        className="flex items-center gap-3 text-base p-4 text-gray-500 hover:gap-4 hover:text-neutral-950 transition-all duration-200"
      >
        <FiLogOut className="h-5 w-5 max-xl:flex-1" />
        <span className="hidden xl:flex-1 xl:block">Logout</span>
      </button>
    </div>
  );
}

export default Sidebar;
