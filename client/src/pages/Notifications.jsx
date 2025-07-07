import { useState } from "react";
import { useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { FaUserGroup } from "react-icons/fa6";
import { useAuth } from "../context/UserContextProvider";

function Notifications() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const { fetchUnreadCount } = useAuth();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        api_paths.notifications.get_all_notifications
      );

      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      toast.error("error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col items-start">
        {notifications.map((notification) => (
          <div
            key={notification?._id}
            className="flex items-center w-full p-6 py-8 border-b border-gray-300"
          >
            <div className="self-start px-2 text-primary">
              <FaUserGroup className="size-6" />
            </div>
            <div>
              <p className="font-medium text-gray-700">{notification?.title}</p>
              <Link
                to={`/clubs/${notification?.relatedClub?.name}/events/${notification?.relatedEvent?._id}`}
              >
                <p className="text-gray-500">
                  {notification?.relatedEvent?.title}
                </p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
