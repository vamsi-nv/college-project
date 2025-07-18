import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UserContext = createContext();

function UserContextProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchCurrentUser = async () => {
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
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
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
  };

  const logout = () => {
    setUser(null); // {} is a truthy value
    localStorage.removeItem("college-token");
    navigate("/login");
  };

  const value = {
    user,
    logout,
    loading,
    fetchCurrentUser,
    fetchUnreadCount,
    unreadCount,
    setUser
  };

  useEffect(() => {
    fetchCurrentUser();
    if (user) {
      fetchUnreadCount();
    }
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContextProvider;

export const useAuth = function () {
  return useContext(UserContext);
};
