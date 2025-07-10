import Logo from "../assets/globe.svg?react";
import { motion } from "motion/react";
import { BsStars } from "react-icons/bs";
import { LuArrowRight } from "react-icons/lu";
import { Link } from "react-router-dom";
function LandingPage() {
  return (
    <div
      className="relative z-0 w-full min-h-screen bg-neutral-950"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(100, 100, 100, 0.1) 0.5px, transparent 1px),
          linear-gradient(to bottom, rgba(100, 100, 100, 0.1) 0.5px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    >
      <header className="flex items-center justify-between max-w-6xl p-4 py-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-1"
        >
          <Logo className="w-8 text-blue-600 md:w-14" />
          <h2 className="text-xl font-semibold text-transparent md:text-2xl bg-gradient-to-b from-white to-blue-100 bg-clip-text">
            CSphere
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
        >
          <Link to={"/register"}>
            <button className="px-3 py-2 text-white flex items-center gap-1 hover:gap-1.5 transition-all duration-300 rounded-full shadow-sm max-sm:text-xs sm:text-sm bg-gradient-to-r from-primary to-blue-600 hover:scale-105 shadow-blue-600/40 hover:shadow-lg hover:shadow-blue-500/30 relative">
              Get Started <LuArrowRight />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-r from-transparent via-blue-100 to-transparent h-0.5 w-[85%] place-self-center"></span>
            </button>
          </Link>
        </motion.div>
      </header>
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center flex-col ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="max-w-5xl mb-6 text-2xl text-center sm:text-3xl md:mb-10 md:text-5xl lg:text-6xl md:leading-14 lg:leading-18">
            <span className="font-bold text-transparent bg-gradient-to-b from-white to-blue-700 bg-clip-text">
              Your gateway to every club, event, and connection.
            </span>
          </h1>
          <p className="mx-auto text-sm text-center text-gray-500 md:max-w-3xl md:text-lg">
            Discover campus life with CSphere. Join now <br /> to{" "}
            <span className="text-gray-300">engage</span>,{" "}
            <span className="text-gray-300">explore</span>, and{" "}
            <span className="text-gray-300">connect</span> with your community.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-6 mt-12"
        >
          <Link to={"/login"}>
            <button className="px-6 py-2.5 font-medium text-white transition-all duration-300 rounded-full shadow-sm max-sm:text-xs sm:py-2 hover:scale-105 bg-gradient-to-r from-primary to-blue-600 shadow-blue-600/40 hover:shadow-md hover:shadow-blue-600/30">
              Login
            </button>
          </Link>

          <Link to={"/register"}>
            <button className="px-5 py-2 font-medium transition-all rounded-full shadow-sm max-sm:text-xs sm:py-2 bg-primary/20 outline-2 text-primary outline-primary hover:bg-gradient-to-r from-primary to-blue-600 hover:text-white hover:outline-none">
              Sign Up
            </button>
          </Link>
        </motion.div>
      </main>

      <motion.div
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute text-yellow-400 rotate-45 top-50 left-80 size-12"
      >
        <BsStars />
      </motion.div>

      <div className="absolute -z-1  -top-[200px] mx-auto inset-x-0 w-[600px] h-[600px] rounded-full bg-primary/15 shadow-2xl shadow-primary/10 blur-[100px]"></div>
      <div className="absolute -z-1 -top-[200px] mx-auto inset-x-0 w-[700px] h-[700px] rounded-full bg-primary/10 shadow-2xl shadow-primary/10 blur-[100px]"></div>
      <div className="absolute -z-1 -top-[200px] mx-auto inset-x-0 w-[800px] h-[800px] rounded-full bg-primary/5 shadow-2xl shadow-primary/10 blur-[100px]"></div>
    </div>
  );
}

export default LandingPage;
