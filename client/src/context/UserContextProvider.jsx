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
import { fetchUserClubs } from "../utils/services";

const UserContext = createContext();

function UserContextProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessageCounts, setUnreadMessageCounts] = useState({});
  const [userClubs, setUserClubs] = useState([]);

  const logout = useCallback(() => {
    setUser(null);
    setUnreadMessageCounts({});
    setUserClubs([]);
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

  const fetchUserClubsData = useCallback(async () => {
    try {
      const clubs = await fetchUserClubs();
      if (clubs) {
        setUserClubs(clubs);
        return clubs;
      }
    } catch (error) {
      console.error("Error fetching user clubs:", error);
    }
    return [];
  }, []);

  const fetchUnreadMessageCounts = useCallback(async (clubIds) => {
    if (!clubIds || clubIds.length === 0) {
      setUnreadMessageCounts({});
      return;
    }

    try {
      const clubIdsString = clubIds.join(",");
      const response = await axiosInstance.get(
        `${api_paths.messages.get_unread_messages_count}?clubIds=${clubIdsString}`
      );

      const data = response.data;
      if (data.success) {
        setUnreadMessageCounts(data.unreadMessagesCounts);
      }
    } catch (error) {
      console.error("Error fetching unread message counts:", error);
    }
  }, []);

  const markClubMessagesAsRead = useCallback(async (clubId) => {
    try {
      await axiosInstance.patch(api_paths.messages.mark_read_many, { clubId });

      setUnreadMessageCounts((prev) => ({
        ...prev,
        [clubId]: 0,
      }));
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }, []);

  // const updateUnreadMessageCount = useCallback((clubId, count) => {
  //   setUnreadMessageCounts((prev) => ({
  //     ...prev,
  //     [clubId]: count,
  //   }));
  // }, []);

  // const incrementUnreadMessageCount = useCallback((clubId) => {
  //   setUnreadMessageCounts((prev) => ({
  //     ...prev,
  //     [clubId]: (prev[clubId] || 0) + 1,
  //   }));
  // }, []);

  const value = useMemo(
    () => ({
      user,
      logout,
      loading,
      unreadCount,
      unreadMessageCounts,
      userClubs,
      fetchCurrentUser,
      fetchUnreadCount,
      fetchUserClubsData,
      fetchUnreadMessageCounts,
      markClubMessagesAsRead,
      // updateUnreadMessageCount,
      // incrementUnreadMessageCount,
    }),
    [
      user,
      logout,
      loading,
      unreadCount,
      unreadMessageCounts,
      userClubs,
      fetchCurrentUser,
      fetchUnreadCount,
      fetchUserClubsData,
      fetchUnreadMessageCounts,
      markClubMessagesAsRead,
      // updateUnreadMessageCount,
      // incrementUnreadMessageCount,
    ]
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

      const messageHandler = ({ clubId }) => {
        console.log(`NEW MESSAGE - Client: Received for club ${clubId}`);
        fetchUnreadMessageCounts([clubId]);
      };

      socket.on("updateUnreadCount", updateHandler);
      socket.on("newMessage", messageHandler);

      return () => {
        socket.off("updateUnreadCount", updateHandler);
        socket.off("newMessage", messageHandler);
      };
    }
  }, [user, fetchUnreadCount]);

  useEffect(() => {
    if (user) {
      const initializeClubData = async () => {
        const clubs = await fetchUserClubsData();
        if (clubs && clubs.length > 0) {
          const clubIds = clubs.map((club) => club._id);
          await fetchUnreadMessageCounts(clubIds);
        }
      };

      initializeClubData();
    }
  }, [user, fetchUserClubsData, fetchUnreadMessageCounts]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContextProvider;
export const useAuth = () => useContext(UserContext);
