import Logo from "../assets/globe.svg?react";
import { IoIosArrowForward } from "react-icons/io";
import { FcCollaboration, FcConferenceCall } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col items-center w-full h-screen bg-gray-50">
      <header className="z-20 flex items-center justify-between w-full max-w-5xl px-4 py-8 mx-auto">
        <div className="flex items-center justify-center gap-1">
          <Logo className="text-blue-600 size-10" />
          <h4 className="text-2xl font-semibold text-transparent max-sm:text-xl bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
            CSphere
          </h4>
        </div>
        <button
          onClick={() => navigate("/register")}
          className="flex items-center gap-1 px-4 py-2 text-sm text-white transition-all duration-300 rounded-full hover:scale-105 max-sm:text-xs bg-gradient-to-r from-primary to-blue-600/95"
        >
          Join now
        </button>
      </header>
      <main className="relative z-20 flex flex-col items-center justify-center flex-1 mx-auto text-center">
        {/* Background cards container */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          {/* Card 1 */}
          <div className="absolute top-20 left-10 w-24 h-24 bg-white shadow-md rounded-xl border border-gray-200 rotate-[-6deg]  opacity-30 flex items-center justify-center text-2xl">
            <FcCollaboration />
          </div>

          {/* Card 2 */}
          <div className="absolute bottom-24 right-20 w-23 h-24 bg-white shadow-md rounded-xl border border-gray-200 rotate-[8deg] opacity-30 flex items-center justify-center text-2xl">
            <FcConferenceCall />
          </div>
        </div>

        <h1 className="max-w-3xl text-3xl font-medium text-transparent md:text-5xl bg-gradient-to-r bg-clip-text from-blue-600 via-primary/90 to-blue-600 ">
          Your gateway to every club, event, and connection.
        </h1>
        <p className="mt-4 text-gray-500 max-sm:max-w-sm max-sm:text-sm">
          Be where the action is. Join, explore, and stay informed — all in one
          place.
        </p>
        <div className="flex items-center justify-center gap-5 mt-8">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 text-white transition-all duration-300 rounded-full hover:scale-105 bg-gradient-to-r from-primary to-blue-600/95"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="flex  z-10 items-center  relative group hover:text-white gap-1 py-2 px-6 overflow-auto shadow-[0_0_0_1px] shadow-primary hover:shadow-none outline-primary text-primary rounded-full max-sm:text-sm"
          >
            Signup
            <span className="absolute inset-0 duration-300 ease-in-out origin-left -translate-x-full bg-gradient-to-r from-primary to-blue-600/95 group-hover:translate-x-0 trasnition-all -z-10"></span>
          </button>
        </div>
      </main>
      <div className="absolute top-0 bg-gradient-to-r from-primary blur-[200px] to-primary h-28 w-1/5 "></div>
    </div>
  );
}

export default LandingPage;
