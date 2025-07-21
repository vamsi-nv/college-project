import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "../context/UserContextProvider";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import { useEffect, useState } from "react";
import logo from "../assets/globe.png";
import { CiLocationArrow1 } from "react-icons/ci";
function AuthPage() {
  const {
    loginWithPopup,
    user: auth0User,
    isAuthenticated,
    isLoading: auth0Loading,
  } = useAuth0();
  const { setUser, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && auth0User && !auth0Loading) {
      console.log("User is authenticated, redirecting to /home");

      if (!user) {
        syncUserWithBackend(auth0User);
      }
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, auth0User, auth0Loading, navigate, user]);

  const syncUserWithBackend = async (auth0User) => {
    try {
      const response = await axiosInstance.post(api_paths.auth.google_auth, {
        email: auth0User.email,
        name: auth0User.name,
        image: auth0User.picture,
      });

      const { token, user: backendUser } = response.data;
      if (!token || !backendUser) {
        throw new Error("Invalid backend response format");
      }
      localStorage.setItem("college-token", token);
      setUser(backendUser);
    } catch (error) {
      console.error("Backend sync failed:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to sync with server."
      );
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithPopup();
    } catch (error) {
      console.error("Popup login failed:", error);
      setError(error.message || "Authentication failed. Please try again.");
      if (error.message.includes("popup")) {
        setError(
          "Popup blocked by browser. Please allow popups and try again."
        );
      }
    } finally {
      console.log("Resetting loading state");
      setTimeout(() => setLoading(false), 100);
    }
  };

  if (loading || auth0Loading) {
    return (
      <div className="grid w-full min-h-screen bg-gray-100 place-content-center">
        <div className="flex items-center gap-2">
          <span className="border-2 border-gray-200 rounded-full border-t-primary animate-spin size-10"></span>
          <span>Please wait...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full min-h-screen place-content-center bg-gray-50">
      {error && <div className="mb-4 text-center text-red-500">{error}</div>}
      <button
        onClick={handleLogin}
        className="flex z-10 items-center relative group hover:text-white gap-1 p-4 overflow-auto shadow-[0_0_0_1px] shadow-primary outline-primary text-primary rounded-lg"
        disabled={loading}
        aria-label="Login with Google"
      >
        Let's get started <CiLocationArrow1 className="stroke-1" />
        <span className="absolute inset-0 duration-300 ease-in-out origin-left -translate-x-full bg-primary group-hover:translate-x-0 trasnition-all -z-10"></span>
      </button>
    </div>
  );
}

export default AuthPage;