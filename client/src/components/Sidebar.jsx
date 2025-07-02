import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiCompass, FiBell, FiUser, FiLogOut } from "react-icons/fi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { useAuth } from "../context/UserContextProvider";
import logo from "../assets/globe.png";
function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

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
    <div
      className={`min-h-screen  top-0 lg:w-60 p-4 bg-gray-50 lg:ml-10 xl:ml-25 lg:p-8 flex flex-col items-start ${
        isMobileMenuOpen
          ? "fixed z-50 translate-x-0"
          : "sm:block md:block hidden max-sm:-translate-x-full sticky"
      }`}
    >
      <Link to={"/"}>
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
      </Link>
      <div className="flex flex-col group">
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
                      isActive ? "stroke-2 text-primary" : "stroke-gray-500"
                    }`}
                  />
                  <span
                    className={`${
                      isMobileMenuOpen ? "max-sm:block" : ""
                    } hidden lg:flex-1 lg:block transition-all duration-200 ${
                      isActive ? "text-primary font-medium" : "text-gray-500"
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
        className={`flex items-center gap-3 text-base p-4 mb-4 text-gray-500 hover:gap-4 hover:text-neutral-950 transition-all duration-200`}
      >
        <FiLogOut className="w-5 h-5 max-xl:flex-1" />
        <span
          className={`${
            isMobileMenuOpen ? "max-sm:block" : ""
          }  hidden lg:flex-1 lg:block`}
        >
          Logout
        </span>
      </button>
      {user?.isAdmin && (
        <button
          onClick={() => navigate("/admin")}
          className={`flex items-center gap-3 text-base p-4 mb-4 text-white rounded-full transition-all duration-300 bg-primary hover:scale-105 hover:bg-primary/90`}
        >
          <MdOutlineAdminPanelSettings className="w-5 h-5 max-xl:flex-1" />
          <span
            className={`${
              isMobileMenuOpen ? "max-sm:block" : ""
            }  hidden lg:flex-1 lg:block`}
          >
            Dashboard
          </span>
        </button>
      )}
      <div className="hidden">
        <div className="flex items-center gap-3">
          <div className="">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt=""
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <></>
            )}
          </div>
          <div>
            <p className="hidden text-sm font-semibold text-gray-500 lg:block">
              {user.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
