import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import socket from "../utils/socket";

const UserContext = createContext();

function UserContextProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("college-token");
    navigate("/login");
  }, [navigate]);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(api_paths.auth.get_current_user);
      const data = response.data;
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error(
        "User fetch failed : ",
        error.response?.data?.message || error.message
      );
      if (error.response?.status === 401) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        api_paths.notifications.get_unread_count
      );
      if (response.data.success) {
        setUnreadCount(response.data.unreadNotificationCount);
      }
    } catch (error) {
      toast.error("Error fetching unread notification count");
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      logout,
      loading,
      unreadCount,
      fetchCurrentUser,
      fetchUnreadCount,
    }),
    [user, logout, loading, unreadCount, fetchCurrentUser, fetchUnreadCount]
  );

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      socket.emit("register", user._id);

      const updateHandler = () => {
        fetchUnreadCount();
      };

      socket.on("updateUnreadCount", updateHandler);
      return () => {
        socket.off("updateUnreadCount", updateHandler);
      };
    }
  }, [user, fetchUnreadCount]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContextProvider;

export const useAuth = () => useContext(UserContext);
