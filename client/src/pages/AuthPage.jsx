import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "../context/UserContextProvider";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from "react";

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
      <div className="min-h-screen w-full grid place-content-center bg-gray-100">
        <div className="flex items-center gap-2">
          <span className="border-2 border-gray-200 border-t-primary animate-spin rounded-full size-10"></span>
          <span>Logging in...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full grid place-content-center bg-gray-100">
      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
      <button
        onClick={handleLogin}
        className="shadow-md p-10 rounded-xl bg-gray-50 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
        aria-label="Login with Google"
      >
        <FcGoogle className="size-5" /> Login with Google
      </button>
    </div>
  );
}

export default AuthPage;
