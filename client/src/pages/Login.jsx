import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import { validateEmail } from "../utils/helper";
import { useAuth } from "../context/UserContextProvider";
import Loader from "../components/Loader";

function Login() {
  const { fetchCurrentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(api_paths.auth.login, {
        email,
        password,
      });
      const data = response.data;
      if (data.success) {
        localStorage.setItem("college-token", response.data.token);
        await fetchCurrentUser();
        navigate("/home");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again"
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-0 flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 items-center justify-center min-h-screen">
      <h2 className="mx-2 my-5 text-3xl font-bold text-center sm:mx-4 sm:text-3xl text-transparent bg-gradient-to-b from-blue-600 via-primary/90 to-blue-600 bg-clip-text">
        Welcome back
      </h2>
      <p className="text-gray-500 text-sm mb-4">Login to your account</p>
      <div className=" p-4  rounded-lg shadow-xl border border-gray-100 w-[90%] sm:max-w-md sm:p-8">
        <form
          onSubmit={handleLogin}
          className="flex flex-col z-20 gap-1 p-2 sm:gap-2"
        >
          <Input
            value={email}
            id="email"
            onChange={({ target }) => setEmail(target.value)}
            type="email"
            label="Email Address"
            placeholder="Enter your email address"
          />
          <Input
            value={password}
            id="password"
            onChange={({ target }) => setPassword(target.value)}
            type="password"
            label="Password"
            placeholder="Enter your password"
          />
          {error && (
            <p className="mb-2 ml-2 text-xs text-red-500 sm:text-sm sm:mb-3 sm:ml-4">
              *{error}
            </p>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full flex items-center justify-center gap-2 form-submit-btn hover:scale-105 transition-all duration-300  text-white p-4 rounded-lg"
          >
            {loading && (
              <span className="border-2 animate-spin border-t-transparent border-white size-4 rounded-full "></span>
            )}

            {loading ? "Please wait..." : "Login"}
          </button>
          <p className="mt-4 ml-2 text-center text-xs text-gray-400 sm:text-sm sm:mb-4 sm:ml-4">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="underline cursor-pointer text-neutral-800"
            >
              Create Account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
