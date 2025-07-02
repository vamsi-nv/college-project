import { useState } from "react";
import logo from "../../assets/globe.png";
import { LuUsers } from "react-icons/lu";
import { TbPresentationAnalytics } from "react-icons/tb";
import { Link, NavLink, Outlet } from "react-router-dom";
import { RiMenu2Fill } from "react-icons/ri";

function Admin() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [
    {
      label: "Dashboard",
      path: "",
      icon: TbPresentationAnalytics,
    },
    {
      label: "Clubs",
      path: "clubs",
      icon: LuUsers,
    },
  ];

  return (
    <div
      className={`min-h-screen relative flex bg-gray-50 ${
        isMobileMenuOpen && "overflow-y-hidden"
      }`}
    >
      <div>
        <div
          className={`min-h-screen  top-0 lg:w-60 p-4 bg-gray-50 lg:ml-10 xl:ml-25 lg:p-8 transfrom transition-transform duration-300 ease-in-out flex flex-col items-start ${
            isMobileMenuOpen
              ? "absolute z-50 translate-x-0"
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
          </div>
        </div>
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

      <div className="min-h-screen border-gray-300 flex-6 xl:flex-5 border-x">
        <Outlet />
      </div>
    </div>
  );
}

export default Admin;
