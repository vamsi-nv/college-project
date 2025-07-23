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

  if (loading) return <Loader />;

  return (
    <div className="relative z-0 flex items-center justify-center min-h-screen">
      <div className=" p-4 border border-gray-200 rounded-lg shadow-lg w-7/8 sm:max-w-md sm:p-8 bg-gray-50">
        <h2 className="mx-2 my-5 text-xl font-semibold text-center sm:mx-4 sm:text-2xl text-primary">
          Login
        </h2>
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-1 p-2 sm:gap-2"
        >
          <Input
            value={email}
            id="email"
            onChange={({ target }) => setEmail(target.value)}
            type="email"
            label="Email"
            placeholder="Enter your email"
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

          <p className="mb-2 ml-2 text-xs text-gray-400 sm:text-sm sm:mb-4 sm:ml-4">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="underline cursor-pointer text-neutral-800"
            >
              signup
            </span>
          </p>

          <button type="submit" className="w-full form-submit-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
