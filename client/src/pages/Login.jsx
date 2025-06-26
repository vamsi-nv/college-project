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
        navigate("/");
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
    <div className="min-h-screen flex items-center justify-center px-2">
      <div className="w-full max-w-md sm:max-w-lg  shadow-md border border-gray-200 p-4 sm:p-8 bg-gray-50 rounded-lg">
        <h2 className="mx-2 sm:mx-4 my-5 font-semibold text-xl sm:text-2xl text-center text-primary">
          Login
        </h2>
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-1 sm:gap-4 p-2 sm:p-4"
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
            <p className="text-xs sm:text-sm text-red-500 mb-2 sm:mb-3 ml-2 sm:ml-4">
              *{error}
            </p>
          )}

          <p className="text-xs sm:text-sm mb-2 sm:mb-4 ml-2 sm:ml-4 text-gray-400">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="cursor-pointer text-neutral-800 underline"
            >
              signup
            </span>
          </p>

          <button type="submit" className="form-submit-btn w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
